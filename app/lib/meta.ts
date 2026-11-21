import type { MetaDescriptor } from "react-router";

export const SITE_URL = "https://nan.fyi";

/**
 * The subset of Next.js' `Metadata` object this site used. Pages describe
 * their metadata in this shape and `toMeta` turns it into React Router meta
 * descriptors, so the rendered tags match what Next.js used to emit.
 */
export type Metadata = {
  title?: string;
  description?: string;
  authors?: { name: string; url?: string }[];
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    creator?: string;
  };
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
  };
};

const author = {
  name: "Nanda Syahrasyad",
  url: "https://twitter.com/nandafyi",
};

/** Defaults from the old `app/(main)/layout.tsx`. */
export const siteMetadata = {
  title: "Not a Number",
  description:
    "An interactive blog on computer science and web development, by Nanda Syahrasyad.",
  authors: [author],
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
    url: SITE_URL,
    siteName: "Not a Number",
  },
} satisfies Metadata;

/** Builds the metadata for an article from its title and description. */
export function articleMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    authors: [author],
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@nandafyi",
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Not a Number",
    },
  };
}

function absolute(url: string) {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export function toMeta(
  metadata: Metadata,
  { image, themeColor }: { image?: string; themeColor?: string } = {},
): MetaDescriptor[] {
  const { title, description, authors, twitter, openGraph } = metadata;
  const tags: MetaDescriptor[] = [];
  if (title) tags.push({ title });
  if (description) tags.push({ name: "description", content: description });
  for (const { name, url } of authors ?? []) {
    if (url) tags.push({ tagName: "link", rel: "author", href: url });
    tags.push({ name: "author", content: name });
  }
  if (themeColor) tags.push({ name: "theme-color", content: themeColor });
  if (openGraph?.title) tags.push({ property: "og:title", content: openGraph.title });
  if (openGraph?.description)
    tags.push({ property: "og:description", content: openGraph.description });
  if (openGraph?.url) tags.push({ property: "og:url", content: openGraph.url });
  if (openGraph?.siteName)
    tags.push({ property: "og:site_name", content: openGraph.siteName });
  if (image) {
    tags.push({ property: "og:image", content: absolute(image) });
    tags.push({ property: "og:image:type", content: "image/png" });
  }
  if (twitter?.card) tags.push({ name: "twitter:card", content: twitter.card });
  if (twitter?.creator) tags.push({ name: "twitter:creator", content: twitter.creator });
  if (twitter?.title) tags.push({ name: "twitter:title", content: twitter.title });
  if (twitter?.description)
    tags.push({ name: "twitter:description", content: twitter.description });
  if (image) tags.push({ name: "twitter:image", content: absolute(image) });
  return tags;
}
