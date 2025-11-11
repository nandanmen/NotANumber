import type { ReactNode } from "react";
import Link from "next/link";
import { PostsFooter } from "../footer";
import { XIcon } from "../posts";
import { Subscribe } from "./subscribe";

export default async function ContentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="bg-gray4 md:border-x border-b border-gray8 relative">
        <div className="fixed bottom-0 md:top-0 md:bottom-auto w-full max-w-[1450px] z-20 md:px-4 left-1/2 -translate-x-1/2 md:border-x border-transparent">
          <header className="px-6 md:px-8 lg:px-10 py-3 border-t md:border-t-0 md:border-b border-borderStrong md:border-borderSoft bg-gray4 text-gray11 flex justify-between items-center">
            <h2 className="font-serif text-2xl translate-y-0.5">
              <Link href="/">NaN</Link>
            </h2>
            <Subscribe />
          </header>
        </div>
        <article className="p-6 pt-16 md:p-8 md:pt-[89px] lg:p-10 lg:pt-[105px] grid grid-cols-[1fr_100%_1fr] md:grid-cols-[1fr_min(60ch,100%)_1fr] lg:grid-cols-[1fr_min(900px,100%)_1fr] gap-y-5 leading-relaxed [&>*]:col-start-2 [&>*]:max-w-[60ch] pb-24 md:pb-24 lg:pb-32">
          {children}
        </article>
        <span className="text-gray10 hidden md:block">
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
