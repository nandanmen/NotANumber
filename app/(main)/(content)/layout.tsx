import Link from "next/link";
import type { ReactNode } from "react";
import { Subscribe } from "./subscribe";

export default async function ContentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <div className="w-full max-w-[1600px] z-20 md:border-x border-transparent mx-auto sticky top-0">
        <header className="h-16 text-gray11 flex justify-between items-center px-3">
          <h2 className="font-serif text-2xl translate-y-0.5">
            <Link href="/">NaN</Link>
          </h2>
          <Subscribe />
        </header>
      </div>
      {children}
    </div>
  );
}
