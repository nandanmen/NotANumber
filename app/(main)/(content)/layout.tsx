import Link from "next/link";
import type { ReactNode } from "react";
import { Subscribe } from "./subscribe";

export default async function ContentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[250px_1fr] divide-x divide-borderStrong">
      <aside>
        <header className="flex p-4 justify-between">
          <h2 className="font-serif text-2xl translate-y-0.5 text-gray11">
            <Link href="/">NaN</Link>
          </h2>
          <Subscribe />
        </header>
      </aside>
      {children}
    </div>
  );
}
