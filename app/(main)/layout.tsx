import { BackgroundStripes } from "~/components/stripe-pattern";
import type { Metadata, Viewport } from "next";
import { XIcon } from "./posts";
import { PostsFooter } from "./footer";

export const viewport: Viewport = {
  themeColor: "var(--gray4)",
};

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
    <div className="min-h-screen w-screen isolate">
      <BackgroundStripes className="fixed inset-0" />
      <div className="relative z-10 mx-auto md:px-4 max-w-[1450px] w-full">
        {children}
      </div>
    </div>
  );
}
