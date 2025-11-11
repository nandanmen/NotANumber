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
        title="Path Animations"
        description="The different ways you can use SVG paths to create animations."
      />
      {children}
    </>
  );
}
