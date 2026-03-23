import React from "react";
import { createHighlighter, type Highlighter } from "shiki";

const getHighlighter = async () => {
  const theme = await fetch(`/shiki/dark-default.json`).then((res) =>
    res.json()
  );
  return createHighlighter({
    themes: [theme],
    langs: ["js", "ts", "jsx", "tsx", "html"],
  });
};

let cachedHighlighter: Highlighter | null = null;

export const useHighlighter = (): Highlighter | null => {
  const [_highlighter, setHighlighter] =
    React.useState<shiki.Highlighter | null>(() => cachedHighlighter);

  React.useEffect(() => {
    if (!_highlighter) {
      getHighlighter().then((highlighter) => {
        cachedHighlighter = highlighter;
        setHighlighter(highlighter);
      });
    }
  }, [_highlighter]);

  return _highlighter;
};
