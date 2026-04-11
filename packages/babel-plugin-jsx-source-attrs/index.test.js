const path = require("path");
const { transformSync } = require("@babel/core");
const jsxSourcePlugin = require("./index.js");

const PROJ = "/Users/proj/nan";

const presetReactRoot = path.dirname(
  require.resolve("@babel/preset-react/package.json")
);
const transformReactJsx = require.resolve("@babel/plugin-transform-react-jsx", {
  paths: [presetReactRoot],
});

function transform(src, pluginOpts = {}, filename = `${PROJ}/app/Example.tsx`) {
  const result = transformSync(src, {
    filename,
    cwd: PROJ,
    ast: false,
    configFile: false,
    babelrc: false,
    parserOpts: { sourceType: "module", plugins: ["typescript", "jsx"] },
    plugins: [
      [jsxSourcePlugin, { exclude: null, ...pluginOpts }],
      [transformReactJsx, { runtime: "automatic" }],
    ],
  });
  return result?.code ?? "";
}

describe("babel-plugin-jsx-source-attrs", () => {
  it("annotates intrinsic elements with file:line and component", () => {
    const code = transform(`
      export function Page() {
        return <div><span>hi</span></div>;
      }
    `);
    expect(code).toMatch(
      /"data-source-file":\s*"app\/Example\.tsx:3"/
    );
    expect(code).toMatch(/"data-source-component":\s*"Page"/);
    expect((code.match(/"data-source-file"/g) || []).length).toBe(2);
  });

  it("tracks nested PascalCase components", () => {
    const code = transform(`
      export function Outer() {
        const Inner = () => <p>x</p>;
        return <div><Inner /></div>;
      }
    `);
    expect(code).toContain('"data-source-component":');
    expect(code).toMatch(/"data-source-component":\s*"Inner"/);
    expect(code).toMatch(/"data-source-component":\s*"Outer"/);
  });

  it("skips PascalCase custom components when intrinsicOnly is true", () => {
    const code = transform(`
      function Box() { return null; }
      export function Page() {
        return <Box><div /></Box>;
      }
    `);
    expect(code).not.toMatch(/"data-source-component":\s*"Box"/);
    expect(code).toMatch(
      /"data-source-file":\s*"app\/Example\.tsx:4"/
    );
  });

  it("annotates motion.* host elements when intrinsicOnly is true", () => {
    const code = transform(`
      export function Page() {
        return (
          <motion.li>
            <motion.span>a</motion.span>
          </motion.li>
        );
      }
    `);
    expect((code.match(/"data-source-file"/g) || []).length).toBe(2);
    expect(code).toMatch(/"data-source-component":\s*"Page"/);
    expect(code).toMatch(/motion\.li/);
    expect(code).toMatch(/motion\.span/);
  });

  it("annotates PascalCase components when intrinsicOnly is false", () => {
    const code = transform(
      `
      function Box() { return <div />; }
      export function Page() {
        return <Box />;
      }
    `,
      { intrinsicOnly: false }
    );
    expect(code).toMatch(/"data-source-file":\s*"app\/Example\.tsx:\d+"/);
    expect(code).toMatch(/"data-source-component":\s*"Page"/);
  });

  it("uses anonymous label for default export arrow", () => {
    const code = transform(
      `
      export default () => <main />;
    `,
      {},
      `${PROJ}/pages/index.tsx`
    );
    expect(code).toMatch(
      /"data-source-file":\s*"pages\/index\.tsx:2"/
    );
    expect(code).toMatch(/"data-source-component":\s*"Anonymous"/);
  });

  it("skips when data-source-file already exists", () => {
    const code = transform(`
      export function Page() {
        return <div data-source-file="keep" />;
      }
    `);
    expect(code).toContain('"data-source-file": "keep"');
    const matches = code.match(/data-source-file/g);
    expect(matches?.length).toBe(1);
  });

  it("skips React.Fragment opening tags", () => {
    const code = transform(`
      import { Fragment } from 'react';
      export function Page() {
        return (
          <Fragment>
            <div />
          </Fragment>
        );
      }
    `);
    expect(code).toMatch(
      /"data-source-file":\s*"app\/Example\.tsx:6"/
    );
    expect((code.match(/"data-source-file"/g) || []).length).toBe(1);
  });

  it("adds column when includeColumn is true", () => {
    const code = transform(
      `
      export function Page() {
        return <div />;
      }
    `,
      { includeColumn: true }
    );
    expect(code).toMatch(
      /"data-source-file":\s*"app\/Example\.tsx:3:\d+"/
    );
  });

  it("no-ops when enabled is false", () => {
    const code = transform(
      `
      export function Page() {
        return <div />;
      }
    `,
      { enabled: false }
    );
    expect(code).not.toContain('"data-source-file"');
  });

  it("omits data-source-component when moduleLevelLabel is null and stack empty", () => {
    const code = transform(
      `
      const x = <div />;
    `,
      { moduleLevelLabel: null }
    );
    expect(code).toContain('"data-source-file"');
    expect(code).not.toContain('"data-source-component"');
  });
});
