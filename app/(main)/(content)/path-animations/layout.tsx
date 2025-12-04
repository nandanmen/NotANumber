import type { ReactNode } from "react";
import { Header } from "../header";

export default async function PathAnimationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header
        title="Drawing Paths"
        description="A closer look at a common path animation."
      />
      {children}
    </>
  );
}
