import { codeToTokens, type TokensResult, type BundledLanguage } from "shiki";
import { cn } from "~/lib/cn";

export type Token = TokensResult["tokens"][number][number];

export async function getTokens(
  code: string,
  lang: BundledLanguage,
  theme = "github-light"
): Promise<Token[][]> {
  const result = await codeToTokens(code, {
    lang,
    theme,
  });
  return result.tokens;
}

type Diff = {
  additions?: number[];
  deletions?: number[];
};

export async function CodeBlockRaw({
  children,
  lang,
  theme,
  diff,
  highlight,
}: {
  children: string;
  lang: BundledLanguage;
  theme?: string;
  diff?: Diff;
  highlight?: number[];
}) {
  const tokens = await getTokens(children.trim(), lang, theme);
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
              isDeletion && "bg-green3"
            )}
            key={index}
          >
            {(isAddition || isDeletion) && (
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[20px] pl-[6px] w-[20px] block border-r select-none",
                  isAddition && "bg-blue3 text-blue11 border-blue7",
                  isDeletion && "bg-green3 text-green11 border-green7"
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
  lang: BundledLanguage;
  highlight?: number[];
}) {
  return (
    <div
      className={cn(
        "border rounded-md border-gray8 overflow-x-auto bg-gray3",
        diff && "-ml-4 pl-4"
      )}
    >
      <pre
        className={cn(
          "relative p-4 text-sm leading-normal",
          diff && "border-l border-gray7"
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
