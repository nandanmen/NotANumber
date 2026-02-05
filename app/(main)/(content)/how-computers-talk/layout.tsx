import type { ReactNode } from "react";
import { Article, Header } from "../header";

export default async function HowComputersTalkLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <Article>
        <Header
          title="How Computers Talk to Each Other"
          description="Recreating the Internet from the ground up."
        />
        {children}
      </Article>
    </div>
  );
}
