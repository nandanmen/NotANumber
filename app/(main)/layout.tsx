import type { Metadata, Viewport } from "next";
import { Prototyper } from "../../prototyper/prototyper";

export const viewport: Viewport = {
  themeColor: "#ededed",
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
    <div className="min-h-screen isolate">
      {children}
      {process.env.NODE_ENV === "development" ? <Prototyper /> : null}
    </div>
  );
}
