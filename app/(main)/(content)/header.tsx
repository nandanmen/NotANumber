import type { ReactNode } from "react";
import { BackgroundStripes } from "~/components/stripe-pattern";
import { PostsFooter } from "../footer";
import { XIcon } from "../posts";

export function Header({
  title,
  description,
}: {
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <header className="my-16 max-w-[900px] mx-auto space-y-2">
      <h1 className="text-[52px] md:text-[80px] font-serif leading-[1] text-balance">
        {title}
      </h1>
      <p className="text-gray11">{description}</p>
    </header>
  );
}

export function Article({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 top-[160px] border-t border-gray8">
        <BackgroundStripes />
      </div>
      <div className="relative w-full max-w-[1600px] mx-auto ring-1 shadow-sm rounded ring-black/20 bg-gray3 px-3">
        <article className="p-6 pt-16 md:p-8 lg:p-10 lg:pt-16 grid grid-cols-[1fr_100%_1fr] md:grid-cols-[1fr_min(60ch,100%)_1fr] lg:grid-cols-[1fr_min(900px,100%)_1fr] gap-y-5 leading-relaxed [&>*]:col-start-2 [&>*]:max-w-[60ch] pb-24 md:pb-24 lg:pb-32 border-x border-borderSoft">
          {children}
          <span className="text-gray10 hidden md:block">
            <span className="bottom-0 right-0 absolute translate-x-1/2 translate-y-1/2">
              <XIcon />
            </span>
            <span className="bottom-0 left-0 absolute -translate-x-1/2 translate-y-1/2">
              <XIcon />
            </span>
          </span>
        </article>
      </div>
      <div className="pb-4 xl:pb-12">
        <PostsFooter />
      </div>
    </div>
  );
}
