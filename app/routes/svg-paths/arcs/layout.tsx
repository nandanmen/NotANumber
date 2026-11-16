import { Metadata } from "next";
import { readPage } from "../lib/fs";
import { Content } from "./content";

export const metadata: Metadata = {
  title: "SVG Path Commands | Arcs",
  description: `The arc command is the least intuitive of the SVG path commands; let's take a look at how to use it to draw arcs.`,
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "SVG Path Commands | Arcs",
    description: `The arc command is the least intuitive of the SVG path commands; let's take a look at how to use it to draw arcs.`,
    creator: "@nandafyi",
  },
  openGraph: {
    title: "SVG Path Commands | Arcs",
    description: `The arc command is the least intuitive of the SVG path commands; let's take a look at how to use it to draw arcs.`,
    url: "https://nan.fyi/svg-paths",
    siteName: "Not a Number",
  },
};

export default async function ArcsPage({ children }) {
  const { length } = await readPage("arcs", "svg-paths", true);
  return <Content length={length}>{children}</Content>;
}
