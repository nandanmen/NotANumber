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
    <header className="space-y-2 !col-span-2 !max-w-[900px] mb-10">
      <h1 className="text-[52px] md:text-[80px] font-serif leading-[1] text-balance">
        {title}
      </h1>
      <p className="text-gray11">{description}</p>
    </header>
  );
}

export function Article({ children }: { children: ReactNode }) {
  return (
    <article className="grid grid-cols-[1fr_100%_1fr] md:grid-cols-[1fr_min(60ch,100%)_1fr] lg:grid-cols-2 gap-y-5 leading-relaxed [&>*]:col-start-1 [&>*]:max-w-[60ch] p-16 bg-gray3">
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
  );
}
