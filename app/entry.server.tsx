import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { renderToReadableStream } from "react-dom/server";
import { getCssText } from "./stitches.config";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  let status = responseStatusCode;
  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        status = 500;
        console.error(error);
      },
    },
  );

  // Many components are still styled with Stitches, which collects CSS while
  // rendering. Wait for the whole tree to render, then inline that CSS in the
  // <head> so the page doesn't flash unstyled before hydration.
  await body.allReady;

  responseHeaders.set("Content-Type", "text/html");
  return new Response(body.pipeThrough(injectBeforeHeadClose(getStitchesStyle)), {
    headers: responseHeaders,
    status,
  });
}

function getStitchesStyle() {
  return `<style id="stitches">${getCssText()}</style>`;
}

function injectBeforeHeadClose(getHtml: () => string) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let injected = false;
  let pending = "";
  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      if (injected) {
        controller.enqueue(chunk);
        return;
      }
      pending += decoder.decode(chunk, { stream: true });
      const index = pending.indexOf("</head>");
      if (index === -1) return;
      injected = true;
      controller.enqueue(
        encoder.encode(pending.slice(0, index) + getHtml() + pending.slice(index)),
      );
      pending = "";
    },
    flush(controller) {
      if (pending) controller.enqueue(encoder.encode(pending));
    },
  });
}
