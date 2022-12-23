import React from "react";
import type { GetStaticPropsContext } from "next";
import NextLink from "next/link";
import Head from "next/head";
import { getMDXComponent } from "mdx-bundler/client";
import Balancer from "react-wrap-balancer";

import { getAllPosts, getPost, type Post } from "~/lib/content.server";
import { BASE_URL } from "~/lib/config";
import { darkTheme, styled } from "~/stitches.config";

import { Heading, Subheading } from "~/components/Heading";
import { OrderedList } from "~/components/OrderedList";
import { NewsletterForm } from "~/components/NewsletterForm";
import { MobileBottomBar } from "~/components/MobileBottomBar";
import { Link } from "~/components/Link";
// import { ThemeToggle } from "~/components/ThemeToggle";

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      content: await getPost(context.params?.content as string),
    },
  };
}

export async function getStaticPaths() {
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
  const { frontmatter, headings, slug } = content;
  return (
    <PageWrapper>
      <Head>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
        <meta name="author" content="Nanda Syahrasyad" />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={frontmatter.description} />
        <meta property="og:image" content={`${BASE_URL}/og/${slug}.png`} />
        <meta property="og:url" content={`${BASE_URL}/${slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <MobileBottomBar headings={headings} />
      <Nav>
        <h2>
          <NextLink href="/">
            <a>NaN</a>
          </NextLink>
        </h2>
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
          <Title>
            <Balancer>{frontmatter.title}</Balancer>
          </Title>
          <Blurb>{frontmatter.blurb}</Blurb>
        </Header>
        <PostContent
          components={{
            h2: Heading as any,
            h3: Subheading as any,
            ol: OrderedList as any,
            a: Link as any,
          }}
        />
        <NewsletterWrapper>
          <NewsletterForm />
        </NewsletterWrapper>
      </Article>
    </PageWrapper>
  );
}

const NewsletterWrapper = styled("footer", {
  marginTop: "$24",
});

const Nav = styled("nav", {
  position: "fixed",
  top: "$16",
  bottom: "$16",
  color: "$gray11",
  maxWidth: "$40",
  display: "none",
  flexDirection: "column",
  paddingLeft: "$6",

  "@media (min-width: 72rem)": {
    display: "flex",
  },

  h2: {
    fontFamily: "$serif",
  },

  a: {
    textDecoration: "none",
    color: "inherit",

    "&:hover": {
      color: "$blue9",
    },
  },

  ul: {
    marginTop: "auto",
    listStyle: "none",
    fontSize: "$sm",

    "> :not(:last-child)": {
      marginBottom: "$2",
    },
  },
});

const PageWrapper = styled("main", {
  width: `min(80rem, 100%)`,
  margin: "0 auto",
  padding: "$16 0",
});

const Title = styled("h1", {
  fontSize: "4rem",
  fontFamily: "$serif",
  lineHeight: "$title",
  fontWeight: 500,
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
  margin: "0 auto",
  padding: "0 $4",
  paddingBottom: "$12",

  "@media (min-width: 72rem)": {
    paddingBottom: "$4",
  },

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
    width: "100%",
  },

  "> :where(:not(:last-child))": {
    marginBottom: "$4",
  },

  h2: {
    fontFamily: "$serif",
  },

  "> p": {
    "> span > code, > code": {
      background: "$gray7",
      padding: 2,
      fontSize: "$sm",
    },
  },

  "*": {
    "&[data-theme='dark']": {
      display: "none",
    },

    [`.${darkTheme} &`]: {
      "&[data-theme='light']": {
        display: "none",
      },
      "&[data-theme='dark']": {
        display: "revert",
      },
    },
  },

  pre: {
    marginTop: "$4",
    marginBottom: "$8",
    whiteSpace: "pre-wrap",
    border: "1px solid $gray8",
    padding: "$4",
    borderRadius: "$base",
    fontSize: "$sm",
    overflowX: "auto",
  },

  blockquote: {
    paddingLeft: "$4",
    borderLeft: "2px solid $gray8",
    color: "$gray11",
    fontStyle: "italic",
  },

  hr: {
    marginTop: "$6",
    marginBottom: "$12",
    width: "30%",
    borderTop: "1px solid $gray8",
  },

  "[data-rehype-pretty-code-fragment] > pre": {
    marginBottom: "$4",
  },
});
