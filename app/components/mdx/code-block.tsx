import { createHighlighterCoreSync, type ThemedToken } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import bash from "shiki/langs/bash.mjs";
import css from "shiki/langs/css.mjs";
import html from "shiki/langs/html.mjs";
import javascript from "shiki/langs/javascript.mjs";
import json from "shiki/langs/json.mjs";
import jsx from "shiki/langs/jsx.mjs";
import tsx from "shiki/langs/tsx.mjs";
import typescript from "shiki/langs/typescript.mjs";
import githubLight from "shiki/themes/github-light.mjs";
import { cn } from "~/lib/cn";

export type Token = ThemedToken;

/**
 * A synchronous highlighter (JavaScript regex engine, no WASM) with only the
 * languages the posts use, so code blocks render highlighted on the server
 * and the client alike. In Next.js this was an async server component.
 */
const highlighter = createHighlighterCoreSync({
  themes: [githubLight],
  langs: [bash, css, html, javascript, json, jsx, tsx, typescript],
  engine: createJavaScriptRegexEngine(),
});

const loadedLanguages = new Set(highlighter.getLoadedLanguages());

export function getTokens(
  code: string,
  lang: string,
  theme = "github-light",
): Token[][] {
  return highlighter.codeToTokens(code, {
    lang: lang && loadedLanguages.has(lang) ? lang : "text",
    theme,
  }).tokens;
}

type Diff = {
  additions?: number[];
  deletions?: number[];
};

export function CodeBlockRaw({
  children,
  lang,
  theme,
  diff,
  highlight,
}: {
  children: string;
  lang: string;
  theme?: string;
  diff?: Diff;
  highlight?: number[];
}) {
  const tokens = getTokens(children.trim(), lang, theme);
  return (
    <>
      {tokens.map((line, index) => {
        const isHighlighted = highlight?.includes(index) ?? false;
        const isAddition = diff?.additions?.includes(index) ?? false;
        const isDeletion = diff?.deletions?.includes(index) ?? false;
        return (
          <div
            className={cn(
              "min-h-[21px] -mx-4 px-4 relative",
              (isAddition || isHighlighted) && "bg-blue3",
              isDeletion && "bg-green3",
            )}
            key={index}
          >
            {(isAddition || isDeletion) && (
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[20px] pl-[6px] w-[20px] block border-r select-none",
                  isAddition && "bg-blue3 text-blue11 border-blue7",
                  isDeletion && "bg-green3 text-green11 border-green7",
                )}
              >
                {isAddition ? "+" : "-"}
              </span>
            )}
            {line.map((token, i) => {
              return (
                <span
                  key={i}
                  style={{
                    color: token.color,
                  }}
                >
                  {token.content}
                </span>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export function CodeBlockMain({
  diff,
  children,
  lang,
  highlight,
}: {
  diff?: Diff;
  children: string;
  lang: string;
  highlight?: number[];
}) {
  return (
    <div
      className={cn(
        "rounded-lg ring-1 ring-neutral-950/15 shadow-sm overflow-x-auto bg-gray1",
        diff && "-ml-4 pl-4",
      )}
    >
      <pre
        className={cn(
          "relative p-4 text-sm leading-normal",
          diff && "border-l border-gray7",
        )}
      >
        <CodeBlockRaw diff={diff} highlight={highlight} lang={lang}>
          {children}
        </CodeBlockRaw>
      </pre>
    </div>
  );
}

export function CodeBlock(props: {
  children: any;
  diff?: Diff;
  highlight?: number[];
}) {
  const code = props.children.props.children;
  const lang = props.children.props.className?.replaceAll("language-", "");
  return (
    <CodeBlockMain lang={lang} diff={props.diff} highlight={props.highlight}>
      {code}
    </CodeBlockMain>
  );
}
