import React from "react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getMDXComponent } from "mdx-bundler/client";

import { getPost } from "~/lib/content.server";
import type { Post } from "~/lib/content.server";

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
    <main>
      <article>
        <PostContent />
      </article>
    </main>
  );
}
