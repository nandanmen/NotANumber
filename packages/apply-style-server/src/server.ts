/**
 * Dev server: POST /apply with JSON body `{ edits: ApplyEditItem[] }`.
 * Env: PORT (default 3847), REPO_ROOT, APPLY_STYLE_SKIP_BIOME=1 to skip async Biome.
 * Run with REPO_ROOT set to the Next app root so `sourceFile` paths match babel-plugin-jsx-source-attrs.
 * After a successful response, changed files are formatted with Biome in a detached process
 * (see `APPLY_STYLE_SKIP_BIOME=1` to disable).
 *
 * Example:
 *   curl -s -X POST http://localhost:3847/apply \
 *     -H 'Content-Type: application/json' \
 *     -d '{"edits":[{"sourceFile":"app/page.tsx:10","edits":{"width":100}}]}'
 */

import http from "node:http";

import path from "node:path";
import { type ApplyEditItem, applyEditsBatch } from "./apply-batch.js";
import { scheduleBiomeFormatAfterResponse } from "./biome-async.js";

const MAX_BODY = 10 * 1024 * 1024;

function corsHeaders(req: http.IncomingMessage): Record<string, string> {
  const origin = req.headers.origin;
  return {
    "Access-Control-Allow-Origin": typeof origin === "string" ? origin : "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function readJsonBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > MAX_BODY) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(raw) as unknown);
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseApplyBody(body: unknown): ApplyEditItem[] {
  if (!isRecord(body)) {
    throw new Error("Body must be a JSON object");
  }
  const edits = body.edits;
  if (!Array.isArray(edits)) {
    throw new Error("Missing or invalid `edits` array");
  }
  const out: ApplyEditItem[] = [];
  for (let i = 0; i < edits.length; i++) {
    const row = edits[i];
    if (!isRecord(row)) {
      throw new Error(`edits[${i}] must be an object`);
    }
    if (typeof row.sourceFile !== "string") {
      throw new Error(`edits[${i}].sourceFile must be a string`);
    }
    if (!isRecord(row.edits)) {
      throw new Error(`edits[${i}].edits must be an object`);
    }
    const styleEdits: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(row.edits)) {
      if (typeof v === "string" || typeof v === "number") {
        styleEdits[k] = v;
      } else {
        throw new Error(`edits[${i}].edits.${k} must be a string or number`);
      }
    }
    out.push({ sourceFile: row.sourceFile, edits: styleEdits });
  }
  return out;
}

export function createApplyServer(repoRoot: string): http.Server {
  return http.createServer(async (req, res) => {
    const c = corsHeaders(req);
    for (const [k, v] of Object.entries(c)) {
      res.setHeader(k, v);
    }

    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    if (req.method !== "POST" || req.url !== "/apply") {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    try {
      const body = await readJsonBody(req);
      const items = parseApplyBody(body);
      const { applied, results, writtenFiles } = applyEditsBatch(
        items,
        repoRoot,
      );
      scheduleBiomeFormatAfterResponse(res, writtenFiles, repoRoot);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ applied, results }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const status = msg === "Request body too large" ? 413 : 400;
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: msg }));
    }
  });
}

export function startApplyServer(): http.Server {
  const port = Number(process.env.PORT) || 3847;
  const repoRoot = process.env.REPO_ROOT
    ? process.env.REPO_ROOT
    : path.join(process.cwd(), "..", "..");
  const server = createApplyServer(repoRoot);
  server.listen(port, () => {
    console.error(
      `apply-style-server listening on http://localhost:${port} (REPO_ROOT=${repoRoot})`,
    );
  });
  return server;
}
