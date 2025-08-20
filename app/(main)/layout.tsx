import { BackgroundStripes } from "~/components/stripe-pattern";
import { Metadata } from "next";
import { posts, XIcon } from "./posts";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not a Number",
  description:
    "An interactive blog on computer science and web development, by Nanda Syahrasyad.",
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "Not a Number",
    description:
      "An interactive blog on computer science and web development, by Nanda Syahrasyad.",
    creator: "@nandafyi",
  },
  openGraph: {
    title: "Not a Number",
    description:
      "An interactive blog on computer science and web development, by Nanda Syahrasyad.",
    url: "https://nan.fyi",
    siteName: "Not a Number",
  },
  metadataBase: new URL("https://nan.fyi"),
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen isolate pb-12">
      <BackgroundStripes className="fixed inset-0" />
      <div className="relative z-10 mx-auto px-4 max-w-[1450px] w-full">
        <div className="bg-gray4 border-x border-b border-gray8 pb-8 relative">
          {children}
          <span className="text-gray10">
            <span className="bottom-0 right-0 absolute translate-x-1/2 translate-y-1/2">
              <XIcon />
            </span>
            <span className="bottom-0 left-0 absolute -translate-x-1/2 translate-y-1/2">
              <XIcon />
            </span>
          </span>
        </div>
      </div>
      <footer className="relative mx-auto px-4 max-w-[1250px] w-full">
        <p className="font-serif text-[190px] translate-y-[0.15em] leading-none text-gray6 text-center">
          Not a Number
        </p>
        <ul className="border border-gray8 bg-gray4 -mt-8 relative grid grid-cols-2">
          {posts.map((post) => (
            <li
              className="grid grid-cols-[60px_1fr] p-4 gap-5 items-center [&:nth-child(2n)]:border-l border-gray7 border-b -mb-px"
              key={post.slug}
            >
              <img
                className="shrink-0 h-min"
                src={post.image.src}
                width="60"
                height="60"
                alt=""
              />
              <article>
                <Link className="font-medium" href={post.slug}>
                  {post.title}
                </Link>
                <p className="text-gray11">{post.shortDescription}</p>
              </article>
            </li>
          ))}
          <span className="text-gray10">
            <span className="top-0 left-0 absolute -translate-x-1/2 -translate-y-1/2">
              <XIcon />
            </span>
            <span className="absolute -translate-x-1/2 -translate-y-1/2">
              <XIcon />
            </span>
            <span className="top-0 right-0 absolute translate-x-1/2 -translate-y-1/2">
              <XIcon />
            </span>
            <span className="right-0 absolute translate-x-1/2 -translate-y-1/2">
              <XIcon />
            </span>
          </span>
        </ul>
      </footer>
    </div>
  );
}
