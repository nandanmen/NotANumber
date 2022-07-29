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

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  day: "numeric",
});

export default function PostPage() {
  const content = useLoaderData<Post>();
  const PostContent = React.useMemo(
    () => getMDXComponent(content.code),
    [content.code]
  );
  const { frontmatter } = content;
  return (
    <PageWrapper>
      <Article>
        <Header>
          <LastUpdated>
            {formatter.format(new Date(frontmatter.editedAt))}
          </LastUpdated>
          <Title>{frontmatter.title}</Title>
          <Blurb>{frontmatter.blurb}</Blurb>
        </Header>
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

const Title = styled("h1", {
  fontSize: "4rem",
  fontFamily: "$serif",
  lineHeight: "$title",
});

const Blurb = styled("p", {
  fontSize: "$lg",
});

const LastUpdated = styled("p", {
  fontFamily: "$mono",
  color: "$gray10",
});

const Header = styled("header", {
  marginBottom: "8rem",

  "> :not(:last-child)": {
    marginBottom: "$8",
  },
});

const Article = styled("article", {
  lineHeight: "$body",
  maxWidth: 800,
  display: "grid",
  gridTemplateColumns: "min(100%, 65ch) 1fr",
  margin: "0 auto",
  marginTop: "$32",

  "> :where(*)": {
    gridColumn: "1",
  },

  "> :where(:not(:last-child))": {
    marginBottom: "$4",
  },

  h2: {
    fontFamily: "$serif",
  },

  pre: {
    border: "1px solid $gray8",
    padding: "$4",
    borderRadius: 6,
    fontSize: "$sm",
    marginTop: "$4",
    marginBottom: "$8",
  },

  "[data-rehype-pretty-code-fragment] > pre": {
    marginBottom: "$4",
  },
});
