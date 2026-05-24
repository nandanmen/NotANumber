import { Subscribe } from "app/(main)/(content)/subscribe";
import Link from "next/link";
import { CodeBlockMain } from "~/components/mdx/code-block";

const code = `fetch("https://nan.fyi")
  .then((response) => response.text())
  .then((html) => console.log(html)); // html of this web page!`;

export default function InternetPage() {
  return (
    <div>
      <div className="h-[90vh] flex flex-col">
        <header className="flex p-6">
          <p className="font-serif text-2xl translate-y-0.5 text-gray11 hover:text-green9 transition-transform">
            <Link href="/">NaN</Link>
          </p>
          <div className="ml-auto">
            <Subscribe />
          </div>
        </header>
        <div className="border-b border-green9 px-6 grow flex flex-col">
          <div className="grid grid-cols-2 divide-x border border-green9 border-b-0 divide-green9 text-green11 grow">
            <div className="bg-[#CCE3DA] py-20 flex flex-col">
              <article className="max-w-[60ch] text-lg mx-auto flex flex-col justify-between grow">
                <h1 className="font-serif text-8xl text-balance mb-5">
                  How Computers Communicate
                </h1>
                <section className="grid auto-rows-min gap-y-7 leading-relaxed">
                  <p>
                    It's really easy to overlook the way the internet works. In
                    JavaScript, we can make software that talks to other
                    computers on the internet simply using a{" "}
                    <code className="bg-gray1 ring-1 text-[0.875em] px-1 py-0.5 rounded ring-neutral-950/15">
                      fetch
                    </code>{" "}
                    call:
                  </p>
                  <CodeBlockMain lang="js">{code}</CodeBlockMain>
                  <p>
                    But what's really happening under the hood when we do that?
                    How does our request to fetch the webpage actually make it
                    to the server? Let's find out by remaking our own
                    mini-version of the Internet.
                  </p>
                </section>
              </article>
            </div>
            <div className="px-3 flex flex-col">
              <div className="border-x border-green9 grow">Hello</div>
            </div>
          </div>
        </div>
      </div>
      <main className="grid grid-cols-2 divide-x divide-green9 text-green11 min-h-screen">
        <article>
          <section>
            <h2>A little internet</h2>
            <p>
              One way to transmit data between two computers is to have them
              physically connected to each other—be it through cables or some
              form of wireless technology. To send data, a computer only needs
              to send it along the physical connection.
            </p>
            <CodeBlockMain lang="js">{code}</CodeBlockMain>
            <p>If we add a third computer, we get a network.</p>
          </section>
        </article>
        <div className="p-6 flex">
          <div className="border border-green9 grow" />
        </div>
      </main>
    </div>
  );
}
