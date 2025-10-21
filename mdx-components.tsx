// @ts-nocheck

import type { MDXComponents } from "mdx/types";
import { Annotation } from "./components/mdx/annotation";
import { InlineNote, Note } from "./components/mdx/note";
import { CodeBlock } from "./components/mdx/code-block";
import { OrderedList } from "./components/OrderedList";
import {
  ScrollGroup,
  ScrollFigure,
  ScrollGroupSection,
} from "./components/mdx/scroll-group";
import { FullWidth } from "./components/mdx/full-width";
import { Columns, ColumnRight } from "./components/mdx/columns";
import { Heading } from "./components/mdx/heading";
import { SkipLink } from "./components/mdx/skip-link";
import { Wide } from "./components/mdx/Wide";
import { Aside } from "./components/mdx/aside";
import { cn } from "./lib/cn";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => (
      <Heading level="h1" className="text-3xl font-medium" {...props} />
    ),
    h2: (props) => (
      <Heading level="h2" className="text-2xl font-medium" {...props} />
    ),
    h3: (props) => (
      <Heading level="h3" className="text-xl font-medium" {...props} />
    ),
    strong: (props) => <strong className="font-medium" {...props} />,
    code: (props) => <code className="inline-code" {...props} />,
    pre: CodeBlock,
    ul: (props) => (
      <ul
        className="list-none [&>li]:grid [&>li]:grid-cols-[26px_1fr] [&>li]:before:content-['–'] [&>li]:before:text-gray11"
        {...props}
      />
    ),
    ol: OrderedList,
    hr: () => (
      <hr className="border-gray7 border-dashed md:-mx-10 my-5 !col-span-3 !max-w-[calc(100%+80px)]" />
    ),
    a: (props) => (
      <a
        className="text-gray11 underline underline-offset-2 hover:text-green9"
        {...props}
      />
    ),
    InlineNote,
    Note,
    Annotation,
    ProblemStatement: (props) => {
      return (
        <div className="bg-gray3 ring-1 shadow ring-neutral-950/15 rounded-lg px-4 py-3 relative">
          <header>
            <h4 className="font-medium text-gray11">Problem</h4>
          </header>
          <div>{props.children}</div>
        </div>
      );
    },
    Aside,
    SmallOnly: ({ className, ...props }) => (
      <div className={cn("lg:hidden", className)} {...props} />
    ),
    FullWidth,
    ScrollGroup,
    ScrollGroupSection,
    ScrollFigure,
    Columns,
    ColumnRight,
    SkipLink,
    Wide,
  };
}
