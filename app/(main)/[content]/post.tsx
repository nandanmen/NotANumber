'use client'

import React from "react";
import NextLink from "next/link";
import Head from "next/head";
import { getMDXComponent } from "mdx-bundler/client";
import Balancer from "react-wrap-balancer";

import { type Post } from "~/lib/content.server";
import { BASE_URL } from "~/lib/config";
import { styled } from "~/stitches.config";

import { Heading, Subheading } from "~/components/Heading";
import { OrderedList } from "~/components/OrderedList";
import { NewsletterForm } from "~/components/NewsletterForm";
import { MobileBottomBar } from "~/components/MobileBottomBar";
import { Link } from "~/components/Link";
import { Content } from "~/components/Content";

const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
});

export function PostPage({ content }: { content: Post }) {
    const PostContent = React.useMemo(
        () => getMDXComponent(content.code),
        [content.code]
    );
    const { frontmatter, headings, slug } = content;
    return (
        <>
            <header className="px-4 md:px-8 py-3 border-b border-borderSoft sticky top-0 bg-gray4 z-20 text-gray11 flex justify-between items-center">
                <h2 className="font-serif text-2xl">
                    <NextLink href="/">NaN</NextLink>
                </h2>
                <button className="font-medium text-sm py-1.5 px-3 bg-gray12 text-gray1 rounded-full">
                    Subscribe
                </button>
            </header>
            <main className="lg:grid grid-cols-[250px_1fr]">
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
                <Nav className="border-r border-borderSoft relative">
                    <ul className="p-8 h-fit sticky top-[57px] text-sm space-y-1 text-gray11">
                        {headings.map((heading) => (
                            <li key={heading.id}>
                                <a href={`#${heading.id}`}>{heading.text}</a>
                            </li>
                        ))}
                    </ul>
                </Nav>
                <Article className="p-4 md:p-8" as="article">
                    <Header>
                        <LastUpdated>
                            {formatter.format(new Date(frontmatter.editedAt))}
                        </LastUpdated>
                        <Title className="text-5xl md:text-6xl">
                            <Balancer>{frontmatter.title}</Balancer>
                        </Title>
                        <Blurb>
                            <Balancer>{frontmatter.blurb}</Balancer>
                        </Blurb>
                    </Header>
                    <PostContent
                        components={{
                            h2: Heading as any,
                            h3: Subheading as any,
                            ol: OrderedList as any,
                            a: Link as any,
                        }}
                    />
                    <NewsletterWrapper className="mb-16">
                        <NewsletterForm />
                    </NewsletterWrapper>
                </Article>
            </main>
        </>
    );
}

const NewsletterWrapper = styled("footer", {
    marginTop: "$24",
});

const Nav = styled("nav", {
    color: "$gray11",
    display: "none",

    "@media (min-width: 72rem)": {
        display: "block",
    },

    h2: {
        fontFamily: "var(--font-serif)",
    },

    a: {
        textDecoration: "none",
        color: "inherit",

        "&:hover": {
            color: "$blue9",
        },
    },
});

const Title = styled("h1", {
    fontFamily: "var(--font-serif)",
    lineHeight: "$title",
    fontWeight: 500,
});

const Blurb = styled("p", {
    fontSize: "$lg",
});

const LastUpdated = styled("p", {
    fontFamily: "var(--font-mono)",
    color: "$gray10",
});

const Header = styled("header", {
    marginBottom: "$16",

    "> :not(:last-child)": {
        marginBottom: "$8",
    },
});

const Article = styled(Content, {
    lineHeight: "$body",
    maxWidth: 800,
    display: "grid",
    gridTemplateColumns: "min(100%, 65ch) 1fr",
    margin: "0 auto",

    strong: {
        fontWeight: 500
    }
});