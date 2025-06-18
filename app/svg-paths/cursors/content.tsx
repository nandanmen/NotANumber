"use client";

import { MDX } from "../components/mdx";
import {
  Cursors,
  CursorOverview,
  Practice,
  Corner,
  AbsoluteRelative,
} from "./cursors";
import { StateProvider } from "../components/state-context";
import { initialState } from "./state";
import { ContentWrapper } from "../components/content-wrapper";

export function CursorsContent({ children, length }) {
  return (
    <StateProvider initial={initialState}>
      <ContentWrapper
        content={children}
        numSections={length}
      >
        <Cursors />
      </ContentWrapper>
    </StateProvider>
  );
}
