import React from "react";
import type { GetStaticPropsContext } from "next";
import { getAllPosts, getPost, type Post } from "~/lib/content.server";
import { getMDXComponent } from "mdx-bundler/client";
import { OrderedList } from "~/components/OrderedList";

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      content: await getPost("paths", context.params?.page as string),
      page: context.params?.page as string,
    },
  };
}

export async function getStaticPaths() {
  const posts = (await getAllPosts())
    .filter((post) => post.slug.startsWith("paths/"))
    .map((post) => ({ params: { page: post.slug.replace("paths/", "") } }));
  return {
    paths: posts,
    fallback: false,
  };
}

export default function PathsPage({
  content,
}: {
  content: Post;
  page: string;
}) {
  const Content = React.useMemo(
    () => getMDXComponent(content.code),
    [content.code]
  );
  return <Content components={{ ol: OrderedList as any }} />;
}
