import "~/app.css";
import type { ReactNode } from "react";
import { Button } from "~/components/article/button";
import { CodeBlock } from "./code-block";
import { Icon } from "~/components/article/icon";
import { ScrollerButton } from "~/components/article/scroller-button";
import { Scroller } from "~/components/article/scroller";
import { Steps } from "~/components/article/steps";
import { Toolbar } from "~/components/article/toolbar";
import InternetContent from "./page.mdx";
import { Aside, Callout, Computer, ProblemStatement, Router } from "./components/prose";
import { InterruptedWorldMap } from "./world-map";
import { Provider } from "jotai";

export function meta() {
  return [
    { title: "The Internet" },
    {
      name: "description",
      content: "An introduction to how the internet connects the world.",
    },
  ];
}

const code = `const response = await fetch("https://example.com");
const data = await response.json();
console.log(data);`;

export default function Internet() {
  return (
    <main className="min-h-screen bg-olive-2 text-lg leading-relaxed grid gap-y-24 pb-32">
      <InterruptedWorldMap />
      <header className="w-full max-w-[calc(60ch+2rem)] px-4 mx-auto grid gap-y-6">
        <h1 className="text-[56px] font-serif max-lg:leading-[1.05]">
          How does the Internet work?
        </h1>
        <p>
          It's really easy to overlook the way the internet works. In JavaScript, we can make
          software that talks to other computers on the internet simply using a `fetch` call:
        </p>
        <CodeBlock>
          <div className="language-tsx">{code}</div>
        </CodeBlock>
        <p>
          But what's really happening under the hood when we do that? How does our request to fetch
          the webpage actually make it to the server? Let's find out by remaking our own
          mini-version of the Internet.
        </p>
      </header>
      <div className="px-4">
        <article className="grid grid-cols-[minmax(0,1fr)_minmax(0,60ch)_minmax(0,1fr)] gap-y-6 [&>*:not([data-full-width])]:col-start-2 [&>*[data-full-width]]:col-span-full [&_:not(pre)>code]:bg-white [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:ring-1 [&_:not(pre)>code]:ring-black/15 [&_:not(pre)>code]:text-[0.875em]">
          <Provider>
            <InternetContent
              components={{
                Button,
                Icon,
                Scroller,
                ScrollerButton,
                Steps,
                Toolbar,
                Aside,
                Callout,
                Computer,
                Router,
                ProblemStatement,
                h2: ({ children }: { children: ReactNode }) => (
                  <h2 className="text-2xl font-medium">{children}</h2>
                ),
                h3: ({ children }: { children: ReactNode }) => (
                  <h3 className="text-xl font-medium">{children}</h3>
                ),
                ol: ({ children }: { children: ReactNode }) => (
                  <ol className="grid list-decimal gap-y-2 pl-6 tabular-nums marker:text-gray-9">
                    {children}
                  </ol>
                ),
                ul: ({ children }: { children: ReactNode }) => (
                  <ul className="grid list-disc gap-y-2 pl-6">{children}</ul>
                ),
                a: ({ children, href }: { children: ReactNode; href?: string }) => (
                  <a className="underline [overflow-wrap:anywhere]" href={href}>
                    {children}
                  </a>
                ),
                strong: ({ children }: { children: ReactNode }) => (
                  <strong className="font-medium">{children}</strong>
                ),
                pre: CodeBlock,
              }}
            />
          </Provider>
        </article>
      </div>
    </main>
  );
}
