import React from "react";
import type { GetStaticPropsContext } from "next";
import { styled } from "~/stitches.config";
import { PathPlayground } from "~/components/PathPlayground";
import { getAllPosts, getPost, type Post } from "~/lib/content.server";
import { getMDXComponent } from "mdx-bundler/client";

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      content: await getPost("paths", context.params?.page as string),
    },
  };
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return {
    paths: posts
      .filter((post) => post.slug.startsWith("paths/"))
      .map((post) => ({ params: { page: post.slug.replace("paths/", "") } })),
    fallback: false,
  };
}

export default function PathsPage({ content }: { content: Post }) {
  const Content = React.useMemo(
    () => getMDXComponent(content.code),
    [content.code]
  );
  return (
    <Wrapper>
      <ContentWrapper>
        <aside>
          <Article>
            <Content />
          </Article>
        </aside>
        <Main>
          <PathPlayground />
        </Main>
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled("div", {
  $$padding: "$space$12",
  width: "fit-content",
  minHeight: "100vh",
  margin: "0 auto",
  padding: "$$padding",
});

const ContentWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "50ch 1fr",
  height: "100%",
  minHeight: "calc(100vh - $$padding * 2)",
  gap: "$12",
});

const Main = styled("main", {
  overflowX: "auto",
});

const Article = styled("article", {
  borderRadius: "$base",
  background: "$gray2",
  height: "100%",
  padding: "$8",
  border: "1px solid $gray8",
  lineHeight: "$body",

  "> *": {
    marginBottom: "1em",
  },

  h1: {
    fontSize: "$xl",
    fontWeight: 800,
  },

  hr: {
    margin: "$8 -$8",
    marginTop: "$10",
    borderStyle: "dashed",
    borderColor: "$gray8",
  },

  pre: {
    marginLeft: "-$8",
    marginRight: "-$8",
    background: "$gray4",
    padding: "$4 $8",
    lineHeight: 1.4,
  },

  "code:not(pre code)": {
    background: "$gray6",
    padding: "$1",
    borderRadius: 4,
  },
});
