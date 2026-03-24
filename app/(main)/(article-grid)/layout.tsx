import type { ReactNode } from "react";
import type { CSSProperties } from "react";
import { GridBackground } from "./grid-background";
import { GridSizeProvider } from "./grid-context";
import { Navbar } from "./nav";

export default async function ArticleGridLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="bg-gray3 min-h-screen pb-32 px-5 space-y-16"
      style={
        {
          "--content-width": "1600px",
        } as CSSProperties
      }
    >
      <Navbar />
      <GridSizeProvider>
        <article
          className="mx-auto max-w-[var(--content-width)] grow space-y-16 w-full"
          style={{ "--grid-size": "48px" } as CSSProperties}
        >
          {children}
        </article>
      </GridSizeProvider>
    </div>
  );
}
