import type { ReactNode } from "react";
import Link from "next/link";
import { PostsFooter } from "../footer";
import { XIcon } from "../posts";

export default async function BuildADatabasePage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="bg-gray4 md:border-x border-b border-gray8 relative">
        <div className="fixed top-0 w-full max-w-[1450px] z-20 md:px-4 left-1/2 -translate-x-1/2 border-x border-transparent">
          <header className="px-6 md:px-8 lg:px-10 py-3 border-b border-borderSoft bg-gray4 text-gray11 flex justify-between items-center">
            <h2 className="font-serif text-2xl translate-y-0.5">
              <Link href="/">NaN</Link>
            </h2>
            <button
              className="font-medium text-sm py-1.5 px-3 bg-gray12 text-gray1 rounded-full"
              type="button"
            >
              Subscribe
            </button>
          </header>
        </div>
        <div>
          {/* <aside className="h-[calc(100vh-57px)] sticky top-[57px] flex flex-col text-gray11 p-8 border-r border-borderSoft">
          <ol className="text-sm space-y-1">
            <li>Introduction</li>
            <li>The Humble File</li>
            <li>Your First Index</li>
            <li>Sorted String Tables</li>
            <li>How Hard Drives Work</li>
            <li>Persisting Trees on Disk</li>
          </ol>
        </aside> */}
          <article className="p-6 pt-[81px] md:p-8 md:pt-[89px] lg:p-10 lg:pt-[105px] grid grid-cols-[1fr_min(60ch,100%)_1fr] lg:grid-cols-[1fr_min(900px,100%)_1fr] gap-y-5 leading-relaxed [&>*]:col-start-2 [&>*]:max-w-[60ch]">
            <header className="my-10 !max-w-full space-y-2">
              <h1 className="text-[52px] md:text-[80px] font-serif leading-[1]">
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
        <span className="text-gray10">
          <span className="bottom-0 right-0 absolute translate-x-1/2 translate-y-1/2">
            <XIcon />
          </span>
          <span className="bottom-0 left-0 absolute -translate-x-1/2 translate-y-1/2">
            <XIcon />
          </span>
        </span>
      </div>
      <div className="pb-4 xl:pb-12">
        <PostsFooter />
      </div>
    </>
  );
}
