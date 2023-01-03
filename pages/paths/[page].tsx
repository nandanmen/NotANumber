import React from "react";
import type { GetStaticPropsContext } from "next";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { styled } from "~/stitches.config";
import { InteractivePathPlayground } from "~/components/InteractivePathPlayground";
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

const heart = `M11.995 7.23319
C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972
C4.4959 8.14609 4.2403 10.6312 5.66654 12.3892
L11.995 18.25
L18.3235 12.3892
C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972
C15.8305 5.18899 13.4446 5.60999 11.995 7.23319
Z`;

const paperclip = `M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48`;

const print = `M12 11
c0 3.517-1.099 6.799-2.753 9.571
m-3.44-2.041.054-.09
A13.916 13.916 0 008 11
a4 4 0 118 0
c0 1.017-.07 2.019-.203 3
m-2.118 6.844
A21.88 21.88 0 0015.171 17
m3.839 1.132
c.645-2.266.99-4.659.99-7.132
A8 8 0 008 4.07
M3 15.364
c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4`;

const phone = `M 22 16.92 v 3 a 2 2 0 0 1 -2.18 2 a 19.79 19.79 0 0 1 -8.63 -3.07 a 19.5 19.5 0 0 1 -6 -6 a 19.79 19.79 0 0 1 -3.07 -8.67 A 2 2 0 0 1 4.11 2 h 3 a 2 2 0 0 1 2 1.72 a 12.84 12.84 0 0 0 0.7 2.81 a 2 2 0 0 1 -0.45 2.11 L 8.09 9.91 a 16 16 0 0 0 6 6 l 1.27 -1.27 a 2 2 0 0 1 2.11 -0.45 a 12.84 12.84 0 0 0 2.81 0.7 A 2 2 0 0 1 22 16.92 Z`;

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
            <Footer layout="position">
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
          <InteractivePathPlayground commands={phone} />
        </Main>
      </ContentWrapper>
    </Wrapper>
  );
}

const Footer = styled(motion.footer, {
  display: "flex",
  justifyContent: "flex-end",
  gap: "$1",
  marginTop: "$8",
  marginBottom: 0,
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
  gridTemplateColumns: "50ch calc(100vh - $$padding * 2)",
  height: "100%",
  minHeight: "calc(100vh - $$padding * 2)",
  gap: "$12",
});

const Main = styled("main", {
  overflowX: "auto",
  height: "calc(100vh - $$padding * 2)",
  position: "fixed",
  transform: "translateX(calc(50ch + $space$12))",
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

  "pre, textarea": {
    marginLeft: "-$8",
    marginRight: "-$8",
    background: "$gray4",
    padding: "$4 $8",
    lineHeight: 1.4,
  },

  textarea: {
    display: "block",
    width: "calc(100% + $space$8 * 2)",
    resize: "none",
    border: "none",
    padding: "$8",
    minHeight: 300,
    fontFamily: "$mono",
    fontSize: "inherit",
  },

  "code:not(pre code)": {
    background: "$gray6",
    padding: "0 $1",
    borderRadius: 4,
  },
});
