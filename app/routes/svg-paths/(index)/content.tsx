"use client";

import { initialState, useStateContext } from "./state";
import { StateProvider } from "../components/state-context";
import { ContentWrapper } from "../components/content-wrapper";
import { ReactNode } from "react";
import { VisualWrapper } from "../components/visual-wrapper";
import { Heart } from "./heart";
import * as square from "./square";
import * as commands from "./commands";
import * as absolute from "./absolute";
import { Button } from "../components/button";

export function IndexContent({ children, length }: { children: ReactNode, length: number }) {
  return (
    <StateProvider initial={initialState}>
      <ContentWrapper
        content={children}
        numSections={length}
        prefix={
          <>
            <h1 className="font-serif text-4xl mb-8">
              Understanding SVG Paths
            </h1>
            <p className="text-xl leading-relaxed">
              If you've ever looked at the SVG code for an icon before, you
              might have noticed that they're usually made up of a bunch of{" "}
              <code className="px-2 py-1 bg-gray6 rounded-md">path</code>{" "}
              elements, each with a cryptic{" "}
              <code className="px-2 py-1 bg-gray6 rounded-md">d</code>{" "}
              attribute.
            </p>
          </>
        }
      >
        <VisualWrapper
          components={[
            {
              svg: 25,
              children: <Heart />
            },
            square.page,
            commands.page,
            absolute.page,
            {
              svg: 25,
              children: <Heart />
            },
          ]}
        />
      </ContentWrapper>
    </StateProvider>
  );
}


export function SquareToggle() {
  const { data, set } = useStateContext("intro");
  return (
    <Button
      className="w-1/3 lg:w-full font-semibold py-2"
      onClick={() => set({ toggled: !data.toggled })}
    >
      {data.toggled ? "Straighten!" : "Bend!"}
    </Button>
  );
}
