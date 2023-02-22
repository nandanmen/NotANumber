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
import { phone } from "~/components/paths/templates";

import { componentOrder as secondOrder } from "~/components/paths/02-cursors";

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

const pageComponentOrders = {
  "02-cursors": secondOrder,
};

export default function PathsPage({
  content,
  page,
}: {
  content: Post;
  page: string;
}) {
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
          <VisualWrapper>
            <ActiveComponent page={page} />
          </VisualWrapper>
        </Main>
      </ContentWrapper>
    </Wrapper>
  );
}

const ActiveComponent = ({ page }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const order = pageComponentOrders[page] || [];
  const index = new URL(window.location.href).searchParams.get("index");
  const component = order[Number(index)];

  if (!component) return <InteractivePathPlayground commands={phone} />;
  return component;
};

const Footer = styled(motion.footer, {
  display: "flex",
  justifyContent: "flex-end",
  gap: "$1",
  marginTop: "$8",
  marginBottom: 0,
});

const Wrapper = styled("div", {
  minHeight: "100vh",
});

const ContentWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "60ch 1fr",
  height: "100%",
});

const VisualWrapper = styled("figure", {
  width: "calc(100vh - $space$10 * 2)",
  margin: "0 auto",
  padding: "$10 0",
});

const Main = styled("main", {
  overflowX: "auto",
  height: "100vh",
  position: "sticky",
  top: 0,
});

const Article = styled("article", {
  position: "relative",
  height: "100%",
  padding: "$12",
  border: "1px solid $gray6",
  lineHeight: "$body",

  "> *": {
    marginBottom: "1em",
  },

  h1: {
    fontSize: "$2xl",
    fontWeight: 800,
  },

  hr: {
    margin: "$8 -$12",
    marginTop: "$10",
    borderStyle: "dashed",
    borderColor: "$gray6",
  },

  "pre, textarea": {
    background: "$gray2",
    padding: "$4 $8",
    lineHeight: 1.4,
  },

  textarea: {
    display: "block",
    width: "100%",
    resize: "none",
    border: "1px solid $gray6",
    borderRadius: "$base",
    padding: "$4",
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
