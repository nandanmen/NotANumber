import type { ReactNode } from "react";
import { Header } from "../header";

export default async function HowComputersTalkLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header
        title="How Computers Talk to Each Other"
        description="A deep dive into how computers talk to each other."
      />
      {children}
    </>
  );
}
