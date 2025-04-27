import clsx from "clsx";
import { ReactNode } from "react";
import { BackgroundStripes } from "~/components/stripe-pattern";
import styles from "./page.module.css";
import Link from "next/link";

export default async function BuildADatabasePage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative px-4">
      <div className="fixed inset-0">
        <BackgroundStripes />
      </div>
      <div className="w-full max-w-[1450px] mx-auto relative bg-gray4 border-x border-borderStrong">
        <header className="px-10 py-3 border-b border-borderSoft sticky top-0 bg-gray4 z-20 text-gray11 flex justify-between items-center">
          <h2 className="font-serif text-2xl">
            <Link href="/">NaN</Link>
          </h2>
          <button className="font-medium text-sm py-1.5 px-3 bg-gray12 text-gray1 rounded-full">
            Subscribe
          </button>
        </header>
        <div className="grid grid-cols-[250px_1fr]">
          <aside className="h-[calc(100vh-57px)] sticky top-[57px] flex flex-col text-gray11 p-8 border-r border-borderSoft">
            <ol className="text-sm space-y-1">
              <li>Introduction</li>
              <li>The Humble File</li>
              <li>Your First Index</li>
              <li>Sorted String Tables</li>
              <li>How Hard Drives Work</li>
              <li>Persisting Trees on Disk</li>
            </ol>
          </aside>
          <article className={clsx(styles.article, "p-10")}>
            <header className="my-10 !col-span-2 space-y-2">
              <h1 className="text-[80px] font-serif leading-[1]">
                Build Your Own Database
              </h1>
              <p className="text-gray11">
                A step-by-step guide to building a key-value database from
                scratch.
              </p>
            </header>
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
