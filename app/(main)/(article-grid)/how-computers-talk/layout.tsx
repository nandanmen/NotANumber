import type { ReactNode } from "react";
import { CodeBlockMain } from "~/components/mdx/code-block";
import { ArticleTitle, PageHeader } from "./header";

const code = `fetch("https://nan.fyi")
  .then((response) => response.text())
  .then((html) => console.log(html)); // html of this web page!`;

export default async function HowComputersTalkLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ArticleTitle
        title="How Computers Talk to Each Other"
        description="A deep dive into how computers talk to each other."
      />
      <header className="grid grid-cols-[1fr_min(65ch,100%)_1fr] [&>*]:col-start-2 gap-y-5 leading-relaxed">
        <p>
          It's really easy to overlook the way the internet works. In
          JavaScript, we can make software that talks to other computers on the
          internet simply using a{" "}
          <code className="bg-gray1 ring-1 text-[0.875em] px-1 py-0.5 rounded ring-neutral-950/15">
            fetch
          </code>{" "}
          call:
        </p>
        <CodeBlockMain lang="js">{code}</CodeBlockMain>
        <p>
          But what's really happening under the hood when we do that? How does
          our request to fetch the webpage actually make it to the server? Let's
          find out by remaking our own mini-version of the Internet.
        </p>
      </header>
      {children}
    </>
  );
}
