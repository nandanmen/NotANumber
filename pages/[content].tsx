import React from "react";
import type { GetStaticPropsContext } from "next";
import { getMDXComponent } from "mdx-bundler/client";

import { getAllPosts, getPost, type Post } from "~/lib/content.server";
import { styled } from "~/stitches.config";

import { Heading, Subheading } from "~/components/Heading";
import { OrderedList } from "~/components/OrderedList";

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      content: await getPost(context.params?.content as string),
    },
  };
}

export async function getStaticPaths() {
  // When this is true (in preview environments) don't
  // prerender any static pages
  // (faster builds, but slower initial page load)
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
  const posts = await getAllPosts();
  return {
    paths: posts.map((post) => ({ params: { content: post.slug } })),
    fallback: false,
  };
}

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  day: "numeric",
});

export default function PostPage({ content }: { content: Post }) {
  const PostContent = React.useMemo(
    () => getMDXComponent(content.code),
    [content.code]
  );
  const { frontmatter, headings } = content;
  return (
    <PageWrapper>
      <Nav>
        <h2>NaN</h2>
        <ul>
          {headings.map((heading) => (
            <li key={heading.id}>
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      </Nav>
      <Article>
        <Header>
          <LastUpdated>
            {formatter.format(new Date(frontmatter.editedAt))}
          </LastUpdated>
          <Title>{frontmatter.title}</Title>
          <Blurb>{frontmatter.blurb}</Blurb>
        </Header>
        <PostContent
          components={{
            h2: Heading as any,
            h3: Subheading as any,
            ol: OrderedList as any,
          }}
        />
      </Article>
    </PageWrapper>
  );
}

const Nav = styled("nav", {
  position: "fixed",
  top: "$16",
  bottom: "$16",
  color: "$gray11",
  maxWidth: "$40",
  display: "flex",
  flexDirection: "column",

  h2: {
    fontFamily: "$serif",
  },

  ul: {
    marginTop: "auto",
    listStyle: "none",
    fontSize: "$sm",

    "> :not(:last-child)": {
      marginBottom: "$2",
    },

    a: {
      textDecoration: "none",
      color: "inherit",

      "&:hover": {
        color: "$blue9",
      },
    },
  },
});

const PageWrapper = styled("main", {
  width: `min(80rem, 100vw)`,
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
  marginBottom: "$16",

  "> :not(:last-child)": {
    marginBottom: "$8",
  },
});

const Article = styled("article", {
  lineHeight: "$body",
  maxWidth: 800,
  display: "grid",
  gridTemplateColumns: "min(100%, 65ch) 1fr",
  margin: "$16 auto $40 auto",
  padding: "0 $4",

  "> *": {
    gridColumn: "1",
  },

  "> figure": {
    marginTop: "$4",
    marginBottom: "$8",
  },

  "> .note": {
    gridColumn: "1 / -1",
  },

  "> .full-width": {
    gridColumn: "1 / -1",
    marginTop: "$4",
    marginBottom: "$8",
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
    borderRadius: "$base",
    fontSize: "$sm",
    marginTop: "$4",
    marginBottom: "$8",
  },

  "[data-rehype-pretty-code-fragment] > pre": {
    marginBottom: "$4",
  },
});
