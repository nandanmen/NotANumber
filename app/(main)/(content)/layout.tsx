import Link from "next/link";
import type { ReactNode } from "react";
import { posts } from "../posts";
import { GridBackground } from "./grid-background";
import { Navbar } from "./nav";

export default async function ContentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-gray4 min-h-screen pb-32">
      <Navbar />
      {/* <nav className="col-start-1 fixed hidden">
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.slug}>
                <Link href={post.slug}>{post.title}</Link>
              </li>
            );
          })}
        </ul>
      </nav> */}
      <main className="bg-gray2 ring-1 ring-black/15 mx-10 flex shadow-sm grow">
        <div className="px-2 border-r border-borderSoft flex flex-col justify-around text-gray4">
          {Array.from({ length: 16 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="size-6 bg-current rounded-full" />
          ))}
        </div>
        <article className="grid grid-cols-[1fr_min(60ch,100%)_1fr_50%] [&>*]:col-start-2 [&>*]:w-full [&>*]:max-w-[60ch] auto-rows-min grow gap-y-4 relative leading-relaxed isolate">
          <GridBackground />
          {children}
        </article>
        <div className="w-10 border-l border-borderSoft shrink-0" />
      </main>
    </div>
  );
}
