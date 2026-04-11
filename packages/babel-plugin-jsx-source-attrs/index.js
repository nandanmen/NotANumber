const path = require("path");

/**
 * Babel plugin: inject data-source-file and data-source-component on JSX opening elements.
 * @param {import('@babel/core')} api
 * @param {{
 *   enabled?: boolean;
 *   intrinsicOnly?: boolean; // true: lowercase host tags + motion.<lowercaseTag> (Framer Motion)
 *   includeColumn?: boolean;
 *   anonymousComponentLabel?: string;
 *   moduleLevelLabel?: string | null;
 *   include?: RegExp;
 *   exclude?: RegExp;
 * }} opts
 */
module.exports = function babelPluginJsxSourceAttrs(api, opts) {
  const t = api.types;

  const raw = opts ?? {};
  const {
    enabled = true,
    intrinsicOnly = true,
    includeColumn = false,
    anonymousComponentLabel = "Anonymous",
    moduleLevelLabel = "Module",
    include,
  } = raw;
  const exclude =
    raw.exclude === undefined
      ? /[/\\]node_modules[/\\]/
      : raw.exclude;

  function fileMatches(filename) {
    if (!filename) return true;
    if (exclude && exclude.test(filename)) return false;
    if (include && !include.test(filename)) return false;
    return true;
  }

  function isPascalCase(name) {
    return typeof name === "string" && /^[A-Z]/.test(name);
  }

  function isFunctionLike(node) {
    return (
      t.isArrowFunctionExpression(node) ||
      t.isFunctionExpression(node) ||
      t.isFunctionDeclaration(node)
    );
  }

  function isFragmentOpening(name) {
    if (t.isJSXIdentifier(name)) {
      return name.name === "Fragment";
    }
    if (t.isJSXMemberExpression(name)) {
      return t.isJSXIdentifier(name.property) && name.property.name === "Fragment";
    }
    return false;
  }

  /** Framer Motion / Motion: <motion.div /> — forwards props to a DOM host like an intrinsic. */
  function isMotionHostElement(name) {
    if (!t.isJSXMemberExpression(name)) return false;
    if (!t.isJSXIdentifier(name.object) || name.object.name !== "motion") {
      return false;
    }
    if (!t.isJSXIdentifier(name.property)) return false;
    return /^[a-z]/.test(name.property.name);
  }

  function shouldAnnotateElement(opening, state) {
    const name = opening.name;
    if (isFragmentOpening(name)) return false;
    if (intrinsicOnly) {
      if (t.isJSXIdentifier(name)) {
        return /^[a-z]/.test(name.name);
      }
      return isMotionHostElement(name);
    }
    if (t.isJSXIdentifier(name)) return true;
    if (t.isJSXMemberExpression(name)) return true;
    return false;
  }

  function hasAttr(attributes, dataName) {
    return attributes.some(
      (a) =>
        t.isJSXAttribute(a) &&
        t.isJSXIdentifier(a.name) &&
        a.name.name === dataName
    );
  }

  function sourceFileValue(filename, loc, cwd) {
    let rel = filename || "unknown";
    if (filename && cwd) {
      try {
        rel = path.relative(cwd, filename) || filename;
      } catch {
        rel = filename;
      }
    }
    const line = loc?.start?.line ?? 0;
    const col = loc?.start?.column;
    if (includeColumn && col != null) {
      return `${rel}:${line}:${col + 1}`;
    }
    return `${rel}:${line}`;
  }

  return {
    name: "babel-plugin-jsx-source-attrs",
    visitor: {
      Program: {
        enter(path, state) {
          state.jsxSourceStack = [];
          state.jsxSourceCwd = state.file.opts.cwd ?? process.cwd();
          if (!enabled || !fileMatches(state.file.opts.filename)) {
            state.jsxSourceSkipFile = true;
          } else {
            state.jsxSourceSkipFile = false;
          }
        },
      },

      FunctionDeclaration: {
        enter(path, state) {
          if (state.jsxSourceSkipFile) return;
          const node = path.node;
          const parent = path.parent;
          if (node.id && isPascalCase(node.id.name)) {
            state.jsxSourceStack.push(node.id.name);
          } else if (
            !node.id &&
            t.isExportDefaultDeclaration(parent) &&
            t.isFunctionDeclaration(node)
          ) {
            state.jsxSourceStack.push(anonymousComponentLabel);
          }
        },
        exit(path, state) {
          if (state.jsxSourceSkipFile) return;
          const node = path.node;
          const parent = path.parent;
          if (node.id && isPascalCase(node.id.name)) {
            state.jsxSourceStack.pop();
          } else if (
            !node.id &&
            t.isExportDefaultDeclaration(parent) &&
            t.isFunctionDeclaration(node)
          ) {
            state.jsxSourceStack.pop();
          }
        },
      },

      VariableDeclarator: {
        enter(path, state) {
          if (state.jsxSourceSkipFile) return;
          const { id, init } = path.node;
          if (
            t.isIdentifier(id) &&
            isPascalCase(id.name) &&
            init &&
            isFunctionLike(init)
          ) {
            state.jsxSourceStack.push(id.name);
          }
        },
        exit(path, state) {
          if (state.jsxSourceSkipFile) return;
          const { id, init } = path.node;
          if (
            t.isIdentifier(id) &&
            isPascalCase(id.name) &&
            init &&
            isFunctionLike(init)
          ) {
            state.jsxSourceStack.pop();
          }
        },
      },

      ClassDeclaration: {
        enter(path, state) {
          if (state.jsxSourceSkipFile) return;
          const node = path.node;
          if (node.id && isPascalCase(node.id.name)) {
            state.jsxSourceStack.push(node.id.name);
          }
        },
        exit(path, state) {
          if (state.jsxSourceSkipFile) return;
          const node = path.node;
          if (node.id && isPascalCase(node.id.name)) {
            state.jsxSourceStack.pop();
          }
        },
      },

      ExportDefaultDeclaration: {
        enter(path, state) {
          if (state.jsxSourceSkipFile) return;
          const d = path.node.declaration;
          if (t.isArrowFunctionExpression(d)) {
            state.jsxSourceStack.push(anonymousComponentLabel);
          } else if (t.isFunctionExpression(d) && !d.id) {
            state.jsxSourceStack.push(anonymousComponentLabel);
          }
        },
        exit(path, state) {
          if (state.jsxSourceSkipFile) return;
          const d = path.node.declaration;
          if (t.isArrowFunctionExpression(d)) {
            state.jsxSourceStack.pop();
          } else if (t.isFunctionExpression(d) && !d.id) {
            state.jsxSourceStack.pop();
          }
        },
      },

      JSXOpeningElement(path, state) {
        if (state.jsxSourceSkipFile) return;
        const node = path.node;
        if (!shouldAnnotateElement(node, state)) return;
        if (hasAttr(node.attributes, "data-source-file")) return;

        const filename = state.file.opts.filename;
        const fileStr = sourceFileValue(
          filename,
          node.loc,
          state.jsxSourceCwd
        );

        const stack = state.jsxSourceStack;
        const componentName =
          stack.length > 0
            ? stack[stack.length - 1]
            : moduleLevelLabel;

        const nextAttrs = [...node.attributes];
        nextAttrs.push(
          t.jSXAttribute(
            t.jSXIdentifier("data-source-file"),
            t.stringLiteral(fileStr)
          )
        );
        if (componentName != null && componentName !== "") {
          nextAttrs.push(
            t.jSXAttribute(
              t.jSXIdentifier("data-source-component"),
              t.stringLiteral(componentName)
            )
          );
        }
        node.attributes = nextAttrs;
      },
    },
  };
};
