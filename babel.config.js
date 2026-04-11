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

/** Same shape as the former `.babelrc` (preset-typescript + module-resolver + macros), plus JSX source attrs. */
module.exports = function babelConfig(api) {
  api.cache.using(
    () =>
      `${process.env.NODE_ENV ?? ""}:${process.env.JSX_SOURCE_ATTRS ?? ""}`
  );

  return {
    presets: ["@babel/preset-typescript"],
    plugins: [
      [
        "babel-plugin-module-resolver",
        {
          root: ["."],
          alias: {
            "^~/(.+)": "./\\1",
          },
        },
      ],
      "@babel/plugin-syntax-jsx",
      "babel-plugin-macros",
      [jsxSourcePlugin, jsxSourceOptions],
    ],
  };
};
