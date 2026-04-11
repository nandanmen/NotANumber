import type { ReactNode } from "react";
import type { CSSProperties } from "react";
import { GridSizeProvider } from "./grid-context";
import { Navbar } from "./nav";

export default async function ArticleGridLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="bg-gray3 min-h-screen pb-32 px-[var(--content-padding)] space-y-16"
      style={
        {
          "--content-width": "1480px",
          "--content-padding": "20px",
        } as CSSProperties
      }
    >
      <Navbar />
      <GridSizeProvider>
        <article
          className="article article-layout grow w-full max-w-[var(--content-width)] mx-auto grid"
          style={
            {
              "--grid-size": "48px",
            } as CSSProperties
          }
        >
          {children}
        </article>
      </GridSizeProvider>
    </div>
  );
}
