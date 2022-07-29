import React from "react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getMDXComponent } from "mdx-bundler/client";

import { getPost } from "~/lib/content.server";
import type { Post } from "~/lib/content.server";
import { styled } from "~/stitches.config";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params["*"], "missing slug!");
  return getPost(params["*"]);
};

export default function PostPage() {
  const content = useLoaderData<Post>();
  const PostContent = React.useMemo(
    () => getMDXComponent(content.code),
    [content.code]
  );
  return (
    <PageWrapper>
      <Article>
        <PostContent />
      </Article>
    </PageWrapper>
  );
}

const PAGE_WIDTH = `min(60rem, 100vw)`;

const PageWrapper = styled("main", {
  width: PAGE_WIDTH,
  margin: "0 auto",
});

const Article = styled("article", {
  lineHeight: "$body",
  maxWidth: "65ch",

  "> :not(:last-child)": {
    marginBottom: "$4",
  },
});
