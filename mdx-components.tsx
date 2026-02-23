// @ts-nocheck

import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { OrderedList } from "./components/OrderedList";
import { Wide } from "./components/mdx/Wide";
import { Annotation } from "./components/mdx/annotation";
import { Aside } from "./components/mdx/aside";
import { CodeBlock } from "./components/mdx/code-block";
import { ColumnRight, Columns } from "./components/mdx/columns";
import { FullWidth } from "./components/mdx/full-width";
import { Heading } from "./components/mdx/heading";
import { InlineNote, Note } from "./components/mdx/note";
import {
  ScrollFigure,
  ScrollGroup,
  ScrollGroupSection,
} from "./components/mdx/scroll-group";
import { SkipLink } from "./components/mdx/skip-link";
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
    code: (props) => (
      <code
        className="bg-gray1 ring-1 text-[0.875em] px-1 py-0.5 rounded ring-neutral-950/15"
        {...props}
      />
    ),
    pre: CodeBlock,
    ul: (props) => (
      <ul
        className="list-none relative pl-[26px] [&>li]:before:content-['–'] [&>li]:before:text-gray11 [&>li]:before:absolute [&>li]:before:left-0"
        {...props}
      />
    ),
    ol: OrderedList,
    hr: () => (
      <hr className="border-gray7 border-dashed my-5 !col-start-1 col-span-3 !max-w-full" />
    ),
    a: ({ href, ...props }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a
            className="text-gray11 underline underline-offset-2 hover:text-green9"
            href={href}
            target="_blank"
            rel="noreferrer"
            {...props}
          />
        );
      }
      return (
        <Link
          href={href}
          className="text-gray11 underline underline-offset-2 hover:text-green9"
          {...props}
        />
      );
    },
    InlineNote,
    Note,
    Annotation,
    Callout: (props) => (
      <div
        className="bg-gray3 border border-borderStrong border-dashed rounded-lg px-4 py-3.5 relative"
        {...props}
      />
    ),
    ProblemStatement: (props) => {
      return (
        <div className="rounded-t-lg">
          <header>
            <h4 className="bg-gray3 font-medium text-gray11 text-sm px-4 py-1 rounded-t-lg border border-gray7 border-b-0 -mx-px -mb-1.5 pb-2.5">
              Problem
            </h4>
          </header>
          <div className="bg-gray2 ring-1 shadow ring-neutral-950/15 rounded-lg px-4 py-3 relative">
            {props.children}
          </div>
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
