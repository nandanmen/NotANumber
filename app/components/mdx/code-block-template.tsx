import type { ReactNode } from "react";
import type { Token } from "./code-block";

export type RangeValue = {
  type: "range";
  value: number;
  min: number;
  max: number;
};

export type EnumValue = {
  type: "enum";
  value: string;
  options: string[];
};

export type Value = string | number | RangeValue | EnumValue;

export function CodeBlockTemplate({
  tokens,
  values = {},
  roundDigits = 2,
}: {
  tokens: Token[][];
  values?: Record<string, ReactNode>;
  roundDigits?: number;
}) {
  return (
    <>
      {tokens.map((line, index) => {
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div className="min-h-[21px]" key={index}>
            {line.map((token, i) => {
              return (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={i}
                  style={{
                    color: token.color,
                  }}
                >
                  <Value content={token.content} values={values} />
                </span>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function Value({
  content,
  values,
}: { content: string; values: Record<string, ReactNode> }) {
  const split = content.split(/:([a-z-0-9]+):?/gi);
  if (split.length === 1) return content; // no variables
  const [prefix, name, suffix] = split;
  const value = values[name];
  if (!value) return content;
  return (
    <>
      <span>{prefix}</span>
      {value}
      <span>{suffix}</span>
    </>
  );
}
