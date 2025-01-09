import React from "react";
import * as shiki from "shiki";

const getHighlighter = async () => {
  const theme = await fetch(`/shiki/dark-default.json`).then((res) =>
    res.json()
  );
  return shiki.getHighlighter({
    themes: [theme],
    langs: ["js", "ts", "jsx", "tsx", "html"],
  });
};

let cachedHighlighter: shiki.Highlighter | null = null;

export const useHighlighter = (): shiki.Highlighter | null => {
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
