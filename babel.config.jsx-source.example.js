/**
 * Alternate example: `next/babel` + jsx-source plugin only.
 * This repo uses `babel.config.js` with `@babel/preset-typescript` (matching the old
 * `.babelrc`) so Turbopack expands `babel-plugin-macros` correctly; see root `babel.config.js`.
 */
const jsxSourcePlugin = require.resolve(
  "./packages/babel-plugin-jsx-source-attrs"
);

const jsxSourceOptions = {
  enabled:
    process.env.NODE_ENV !== "production" ||
    process.env.JSX_SOURCE_ATTRS === "1",
  intrinsicOnly: true,
  includeColumn: false,
  anonymousComponentLabel: "Anonymous",
  moduleLevelLabel: "Module",
  exclude: /[/\\]node_modules[/\\]/,
};

module.exports = function babelConfig(api) {
  api.cache.using(
    () =>
      `${process.env.NODE_ENV ?? ""}:${process.env.JSX_SOURCE_ATTRS ?? ""}`
  );

  return {
    presets: ["next/babel"],
    plugins: [[jsxSourcePlugin, jsxSourceOptions]],
  };
};
