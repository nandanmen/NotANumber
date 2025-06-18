// @ts-nocheck

import type { MDXComponents } from "mdx/types";
import { Annotation } from "./components/mdx/annotation";
import { InlineNote, Note } from "./components/mdx/note";
import { CodeBlock } from "./components/mdx/code-block";
import { OrderedList } from "./components/OrderedList";
import { ScrollGroup, ScrollFigure } from "./components/mdx/scroll-group";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => <h1 className="text-3xl font-medium" {...props} />,
    h2: (props) => <h2 className="text-2xl font-medium" {...props} />,
    h3: (props) => <h3 className="text-xl font-medium" {...props} />,
    strong: (props) => <strong className="font-medium" {...props} />,
    code: (props) => <code className="inline-code" {...props} />,
    pre: CodeBlock,
    ul: (props) => <ul className="list-disc pl-4" {...props} />,
    ol: OrderedList,
    hr: () => (
      <hr className="border-gray7 border-dashed -mx-10 my-5 !col-span-2" />
    ),
    a: (props) => (
      <a className="text-gray11 underline underline-offset-2" {...props} />
    ),
    InlineNote,
    Note,
    Annotation,
    ProblemStatement: (props) => {
      return (
        <div className="bg-gray5 border border-borderSoft rounded-lg px-4 py-3 relative">
          <header>
            <h4 className="font-medium text-gray11">Problem</h4>
          </header>
          <div>{props.children}</div>
        </div>
      );
    },
    ScrollGroup,
    ScrollFigure,
  };
}
