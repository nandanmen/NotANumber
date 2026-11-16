import { createRequire } from "node:module";
import path from "node:path";
import { transformAsync } from "@babel/core";
import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { type Plugin, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const require = createRequire(import.meta.url);
const appDir = path.resolve(import.meta.dirname, "app");

/**
 * Runs the Babel-only transforms this codebase relies on before Vite's own
 * JSX/TS handling:
 *
 * - `babel-plugin-macros` for `*.macro.cjs` imports (the tokenizer's
 *   `snapshot` macro), in every mode.
 * - `babel-plugin-jsx-source-attrs` in dev, which tags host elements with
 *   `data-source-*` attributes for the Prototyper overlay.
 */
function babelTransforms(): Plugin {
  let isDev = false;
  return {
    name: "nan:babel-transforms",
    enforce: "pre",
    configResolved(config) {
      isDev = config.command === "serve";
    },
    async transform(code, id) {
      const [file] = id.split("?");
      if (!file.startsWith(appDir) || !/\.[jt]sx?$/.test(file)) return;

      const hasMacro = /\.macro(\.c?js)?["']/.test(code);
      const wantsSourceAttrs = isDev && /\.[jt]sx$/.test(file);
      if (!hasMacro && !wantsSourceAttrs) return;

      const plugins: unknown[] = [];
      if (hasMacro) {
        plugins.push([
          require.resolve("babel-plugin-macros"),
          {
            resolvePath: (source: string, basedir: string) =>
              require.resolve(
                source.startsWith("~/") ? path.join(appDir, source.slice(2)) : source,
                { paths: [basedir] },
              ),
          },
        ]);
      }
      if (wantsSourceAttrs) {
        plugins.push([
          require.resolve("./packages/babel-plugin-jsx-source-attrs"),
          {
            intrinsicOnly: true,
            includeColumn: false,
            anonymousComponentLabel: "Anonymous",
            moduleLevelLabel: "Module",
            exclude: /[/\\]node_modules[/\\]/,
          },
        ]);
      }

      const result = await transformAsync(code, {
        filename: file,
        babelrc: false,
        configFile: false,
        sourceMaps: true,
        parserOpts: { plugins: ["jsx", "typescript"] },
        plugins: plugins as never,
      });
      if (!result?.code) return;
      return { code: result.code, map: result.map };
    },
  };
}

/**
 * MDX, minus `?raw` imports (the SVG paths pages read their own source to
 * count sections); otherwise the raw string module would be compiled as MDX.
 */
function mdxExceptRaw(): Plugin {
  const plugin = mdx({ providerImportSource: "@mdx-js/react" }) as Plugin;
  const transform = plugin.transform as (...args: unknown[]) => unknown;
  return {
    ...plugin,
    transform(code, id) {
      if (/[?&]raw\b/.test(id)) return;
      return transform.call(this, code, id) as never;
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      // `vite-tsconfig-paths` doesn't apply to imports from .mdx files.
      "~": appDir,
      // The package's "module" field points at a file it doesn't ship.
      "@use-it/interval": require.resolve("@use-it/interval/dist/interval.esm.js"),
    },
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    babelTransforms(),
    mdxExceptRaw(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
