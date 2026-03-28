"use client";

import { ToggleButton } from "app/(main)/(article-grid)/database/_components/toggle-button";
import React from "react";
import { Wide } from "~/components/mdx/Wide";

export const Counter = ({ withKey = false, children }) => {
  const [name, setName] = React.useState("John");
  return (
    <Wide>
      <div className="md:grid grid-cols-2 md:rounded-lg border-y md:border-x border-black/15 [&>div:first-child]:ring-0 [&>div:first-child]:shadow-none [&>div:first-child]:rounded-none overflow-hidden divide-y md:divide-y-0 md:divide-x divide-black/15">
        {children}
        <div className="min-h-[200px] grid grid-rows-[auto_min-content] bg-gray5 shadow-inner py-4 gap-6">
          <div className="flex items-center justify-center">
            <_Counter name={name} key={withKey ? name : undefined} />
          </div>
          <ToggleButton
            className="mx-auto"
            onClick={() => setName(name === "Jane" ? "John" : "Jane")}
          >
            Change Name
          </ToggleButton>
        </div>
      </div>
    </Wide>
  );
};

const _Counter = ({ name }) => {
  const [count, setCount] = React.useState(0);
  return (
    <div className="flex items-center justify-between gap-2 bg-gray3 rounded-full w-[160px] p-2 pl-5">
      <p>
        {name}: {count}
      </p>
      <ToggleButton
        className="w-8 p-0 flex items-center justify-center rounded-full"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        <span className="sr-only">Increment</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          width="24"
          aria-hidden="true"
        >
          <path
            d="M12 7V12M12 12V17M12 12H7M12 12H17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </ToggleButton>
    </div>
  );
};
