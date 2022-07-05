import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import tw, { styled, theme } from 'twin.macro'
import { MDXProvider } from '@mdx-js/react'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import { motion } from 'framer-motion'

import FeedbackForm from '@/components/FeedbackForm'
import NewsletterForm from '@/components/NewsletterForm'
import Navigation from '@/components/Navigation'
import { TableOfContents } from '@/components/TableOfContents'

import CodeBlock from '@/elements/CodeBlock'
import ThematicBreak from '@/elements/ThematicBreak'
import ExternalLink from '@/elements/ExternalLink'
import InlineCode from '@/elements/InlineCode'
import UnorderedList from '@/elements/UnorderedList'
import OrderedList from '@/elements/OrderedList'
import { Heading, Subheading, getIdFromChildren } from '@/elements/Heading'
import ProblemStatement from '@/elements/ProblemStatement'

import { formatPath } from '@/lib/utils'

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  day: 'numeric',
})

const CodeBlockWrapper = styled.div``

const mdxComponents = {
  a: ExternalLink,
  pre: CodeBlockWrapper,
  code: CodeBlock,
  hr: ThematicBreak,
  inlineCode: InlineCode,
  ul: UnorderedList,
  ol: OrderedList,
  h2: Heading,
  h3: Subheading,
}

const getAnchors = (children) => {
  return React.Children.toArray(children)
    .filter(
      (child) =>
        child.props?.mdxType && ['h2', 'h3'].includes(child.props.mdxType)
    )
    .map((child) => {
      return {
        url: '#' + getIdFromChildren(child.props.children),
        depth:
          (child.props?.mdxType &&
            parseInt(child.props.mdxType.replace('h', ''), 0)) ??
          0,
        text: child.props.children,
      }
    })
}

export default function Layout({ frontMatter = {}, children }) {
  const slug = formatPath(frontMatter.__resourcePath)
  const anchors = getAnchors(children)
  return (
    <MDXProvider components={mdxComponents}>
      <Article>
        <Head>
          <title>{frontMatter.title}</title>
          <meta name="description" content={frontMatter.description} />
          <meta name="author" content="Nanda Syahrasyad" />
          <meta property="og:title" content={frontMatter.title} />
          <meta property="og:description" content={frontMatter.description} />
          <meta
            property="og:image"
            content={`https://nan.fyi/og-image/${slug}.png`}
          />
          <meta property="og:url" content={`https://nan.fyi/${slug}`} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <header>
          {frontMatter.tldr && <Tldr>TL;DR</Tldr>}
          <Title>{frontMatter.title}</Title>
          <Blurb>{frontMatter.blurb}</Blurb>
        </header>
        <Meta>
          <Author>
            <Avatar src="/avatar.jpg" alt="Nanda Syahrasyad" />
            <p>Nanda Syahrasyad</p>
          </Author>
          {frontMatter.editedAt && (
            <p tw="text-right">
              Last updated {formatter.format(new Date(frontMatter.editedAt))}
            </p>
          )}
        </Meta>
        {frontMatter.tldr && (
          <Link href={`/${frontMatter.tldr}`}>
            <TldrBackLink>
              <HiArrowLeft /> Read the full article
            </TldrBackLink>
          </Link>
        )}
        {frontMatter.hasTldr && (
          <Link href={`/${slug}-tldr`}>
            <TldrLink whileHover={{ scale: 1.1 }}>
              TL;DR
              <HiArrowRight />
            </TldrLink>
          </Link>
        )}
        {children}
        {frontMatter.tldr && (
          <Link href={`/${frontMatter.tldr}`}>
            <TldrBackLink>
              <HiArrowLeft /> Read the full article
            </TldrBackLink>
          </Link>
        )}
        <FormContainer>
          <FeedbackForm slug={frontMatter.__resourcePath} />
          <NewsletterForm />
        </FormContainer>
      </Article>
      <Footer>
        <Navigation style={{ width: 'min(65ch, 100%)' }} tw="mt-8" />
      </Footer>
      <TableOfContents anchors={anchors} />
    </MDXProvider>
  )
}

const TldrBackLink = styled.a`
  ${tw`text-sm text-gray-600 cursor-pointer hover:underline flex items-center gap-2`}
`

const TldrLink = styled(motion.a)`
  ${tw`font-mono text-sm bg-gray-300 w-min p-1 rounded flex items-center gap-2 mb-12! cursor-pointer`}
`

const Tldr = styled.p`
  ${tw`mb-8 font-mono text-sm bg-gray-300 w-min p-1 rounded`}
`

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--gray400);
`

const Author = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);

  > :first-child {
    margin-right: 8px;
  }
`

const Blurb = styled.p`
  ${tw`text-lg`}
  font-family: var(--text-mono);
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
`

const Article = styled.article`
  display: grid;
  padding-top: 10rem;
  padding-bottom: 80px;
  grid-template-columns: 2rem 1fr 2rem;
  margin: 0 -2rem;
  line-height: 1.6;
  font-family: var(--text-sans);

  > * {
    grid-column: 2 / span 1;
    margin-bottom: 1.5em;
  }

  > blockquote {
    border-left: 3px solid var(--gray400);
    padding-left: 1rem;
    color: var(--gray600);
  }

  > header {
    margin-bottom: 8rem;
  }

  > ${Meta} {
    margin-bottom: 64px;
  }

  > figure {
    margin-top: calc(3rem - 1.5em);
    margin-bottom: 3rem;
    max-width: 100vw;
  }

  > ${CodeBlockWrapper} {
    margin-top: 24px;
    margin-bottom: 48px;

    > pre {
      border-radius: 0;
      border-right-width: 0;
      border-left-width: 0;
    }

    grid-column: 1 / -1;
    max-width: 100vw;

    @media screen and (min-width: ${theme`screens.md`}) {
      grid-column: 5 / span 1;

      > pre {
        /* For some reason revert doesn't work here so I have to manually set it back */
        border-radius: 6px;
        border-right-width: 2px;
        border-left-width: 2px;
      }
    }
  }

  > ${ThematicBreak} {
    margin-top: 24px;
    margin-bottom: 48px;
  }

  > h2 {
    margin-top: 80px;
    margin-bottom: 32px;
  }

  > h3 {
    margin-top: 32px;
    margin-bottom: 24px;
  }

  > ${ProblemStatement} {
    margin-bottom: 48px;
  }

  > .full-width,
  > .full-width-2x,
  > .full-width-3x {
    grid-column: 1 / -1;
  }

  @media screen and (min-width: 770px) {
    grid-template-columns:
      1fr minmax(0, 6rem) minmax(0, 4rem) 2rem min(65ch, calc(100% - 2rem))
      2rem minmax(0, 4rem) minmax(0, 6rem) 1fr;

    > * {
      grid-column: 5 / span 1;
    }

    > .full-width {
      grid-column: 4 / -4;
    }

    > .full-width-2x {
      grid-column: 3 / -3;
    }

    > .full-width-3x {
      grid-column: 2 / -2;
    }
  }
`

const Title = styled.h1`
  ${tw`mb-8 font-serif`}

  line-height: 1;
  font-size: 4rem;
`

const FormContainer = styled.div`
  ${tw`space-y-8`}

  transform: translateY(14rem);
  margin-top: -10rem;
`

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  padding: 32px;
  padding-top: 16rem;
  padding-bottom: 6rem;
  color: var(--color-text-secondary);
  height: 320px;
`
