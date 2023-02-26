import React from "react";
import type { GetStaticPropsContext } from "next";
import Link from "next/link";
import { FaListUl, FaHome } from "react-icons/fa";
import { getAllPosts, getPost, type Post } from "~/lib/content.server";
import { getMDXComponent } from "mdx-bundler/client";
import { OrderedList } from "~/components/OrderedList";
import { styled } from "~/stitches.config";

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
  return (
    <Wrapper>
      <ContentWrapper>
        <Box
          as="nav"
          css={{
            borderRight: "1px solid $gray8",
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            position: "sticky",
            top: 0,
          }}
        >
          <Box
            as="ul"
            css={{
              listStyle: "none",
              color: "$gray11",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "$10",
            }}
          >
            <Box
              as="li"
              css={{
                fontFamily: "$serif",
                fontWeight: 500,
                borderBottom: "1px dashed $gray8",

                a: {
                  color: "inherit",
                  textDecoration: "none",
                  padding: "$4",
                  display: "flex",

                  "&:hover": {
                    background: "$gray7",
                  },

                  "&:focus-visible": {
                    background: "$gray7",
                    outline: "none",
                  },
                },
              }}
            >
              <Box as={Link} href="/">
                <a>
                  <FaHome size="20" />
                </a>
              </Box>
            </Box>
            <Box as="li">
              <Box
                as="button"
                css={{
                  padding: "$4",
                  display: "flex",

                  "&:hover": {
                    background: "$gray7",
                  },

                  "&:focus-visible": {
                    background: "$gray7",
                    outline: "none",
                  },
                }}
              >
                <FaListUl size="20" />
              </Box>
            </Box>
          </Box>
        </Box>
        <Content components={{ ol: OrderedList as any }} />
      </ContentWrapper>
    </Wrapper>
  );
}

const Box = styled("div", {});

const Wrapper = styled("div", {
  minHeight: "100vh",
});

const ContentWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "min-content 68ch 1fr",
  height: "100%",
  margin: "0 auto",
  width: "fit-content",
});
