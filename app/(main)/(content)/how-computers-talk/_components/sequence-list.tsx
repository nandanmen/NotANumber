"use client";

import {
  Children,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from "react";
import { cn } from "~/lib/cn";

export function SequenceList({ children }: { children: ReactNode }) {
  // children is an <ol> element; extract its li children
  const ol = children as ReactElement<{ children: ReactNode }>;
  const items = Children.toArray(ol.props.children).filter(isValidElement);

  return (
    <ol className="rounded-xl border border-borderSoft bg-gray3 relative">
      <div className="divide-y divide-borderSoft">
        {items.map((item, i) => {
          return (
            <li className={cn(item.props.className, "p-4 pr-10")} key={i}>
              {item.props.children}
            </li>
          );
        })}
      </div>
      <div className="absolute inset-2 left-auto w-2 bg-gray4 ring-1 ring-black/10 rounded-lg" />
      <button
        className="size-8 bg-gray4 rounded-full ring-1 ring-black/10 shadow absolute top-0 right-3 -translate-y-1/2 translate-x-1/2 overflow-hidden text-gray10 group"
        type="button"
      >
        <span className="sr-only">Play</span>
        <span className="bg-gray1 h-full w-full rounded-full -translate-y-0.5 flex items-center justify-center group-hover:bg-gray2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            width="14"
            aria-hidden="true"
            className="translate-y-0.5"
          >
            <path
              d="M11.1967 2.71828C8.53683 0.970354 5 2.8783 5 6.0611V17.9387C5 21.1215 8.53684 23.0294 11.1967 21.2815L20.234 15.3427C22.6384 13.7627 22.6384 10.2371 20.234 8.65706L11.1967 2.71828Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </button>
    </ol>
  );
}
