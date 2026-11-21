import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  isValidElement,
  useEffect,
  useMemo,
  useState,
} from "react";

type PreProps = ComponentPropsWithoutRef<"pre">;

function getCodeBlock(children: ReactNode) {
  const code = isValidElement<{ children?: ReactNode; className?: string }>(children)
    ? children
    : null;
  const source = typeof code?.props.children === "string" ? code.props.children : "";
  const language = code?.props.className?.replace(/^language-/, "") || "text";

  return { language, source };
}

export function CodeBlock({ children, ...props }: PreProps) {
  const { language, source } = useMemo(() => getCodeBlock(children), [children]);
  const [highlighted, setHighlighted] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    void import("shiki/bundle/web")
      .then(({ codeToHtml }) => codeToHtml(source, { lang: language, theme: "github-light" }))
      .then((html) => {
        if (!cancelled) setHighlighted(html);
      });

    return () => {
      cancelled = true;
    };
  }, [language, source]);

  const content = highlighted ? (
    <div // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  ) : (
    children
  );

  return (
    <pre className="border text-[0.85em] p-4 bg-white overflow-x-auto" {...props}>
      {content}
    </pre>
  );
}
