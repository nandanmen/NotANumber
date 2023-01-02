import React from "react";
import type { GetStaticPropsContext } from "next";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { styled } from "~/stitches.config";
import { PathPlayground } from "~/components/PathPlayground";
import { getAllPosts, getPost, type Post } from "~/lib/content.server";
import { getMDXComponent } from "mdx-bundler/client";
import { IconButton } from "~/components/Visualizer";
import { useRouter } from "next/router";

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      content: await getPost("paths", context.params?.page as string),
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

export default function PathsPage({ content }: { content: Post }) {
  const router = useRouter();
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
            <Footer>
              <IconButton
                onClick={() => {
                  const currentUrl = new URL(window.location.href);
                  const currentIndex = new URL(
                    window.location.href
                  ).searchParams.get("index");
                  if (!currentIndex) return;
                  const newIndex = Number(currentIndex) - 1;
                  if (!newIndex) {
                    router.push(currentUrl.pathname);
                  } else {
                    router.push(`${currentUrl.pathname}?index=${newIndex}`);
                  }
                }}
              >
                <FaArrowLeft />
              </IconButton>
              <IconButton
                onClick={() => {
                  const currentUrl = new URL(window.location.href);
                  let currentIndex: string | number = new URL(
                    window.location.href
                  ).searchParams.get("index");
                  if (!currentIndex) currentIndex = 0;
                  const newIndex = Number(currentIndex) + 1;
                  router.push(`${currentUrl.pathname}?index=${newIndex}`);
                }}
              >
                <FaArrowRight />
              </IconButton>
            </Footer>
          </Article>
        </aside>
        <Main>
          <PathPlayground />
        </Main>
      </ContentWrapper>
    </Wrapper>
  );
}

const Footer = styled("footer", {
  position: "absolute",
  bottom: "$8",
  left: 0,
  right: 0,
  padding: "0 $8",
  display: "flex",
  justifyContent: "flex-end",
  gap: "$1",
  margin: 0,
});

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
  position: "relative",
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
    padding: "0 $1",
    borderRadius: 4,
  },
});
