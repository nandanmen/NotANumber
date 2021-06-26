import React from 'react'
import Head from 'next/head'
import { MDXProvider } from '@mdx-js/react'

import { styled } from '@/stitches'

import CodeBlock from '@/elements/CodeBlock'
import ThematicBreak from '@/elements/ThematicBreak'
import ExternalLink from '@/elements/ExternalLink'
import InlineCode from '@/elements/InlineCode'
import UnorderedList from '@/elements/UnorderedList'
import OrderedList from '@/elements/OrderedList'

import { formatPath } from '@/lib/utils'

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  day: 'numeric',
})

const mdxComponents = {
  a: ExternalLink,
  pre: CodeBlock,
  hr: ThematicBreak,
  inlineCode: InlineCode,
  ul: UnorderedList,
  ol: OrderedList,
}

type Frontmatter = {
  __resourcePath: string
  title: string
  description: string
  blurb: string
  editedAt: string
  publishedAt: string
}

export default function Layout({ frontMatter = {} as Frontmatter, children }) {
  const slug = formatPath(frontMatter.__resourcePath)
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
        <Header>
          <Title>{frontMatter.title}</Title>
          <Blurb>{frontMatter.blurb}</Blurb>
        </Header>
        {children}
      </Article>
    </MDXProvider>
  )
}

const Title = styled('h1', {
  fontSize: '4rem',
  lineHeight: '1',
})

const Blurb = styled('p', {
  color: 'var(--gray600)',
})

const Header = styled('header', {
  marginBottom: '8rem',

  '> :last-child': {
    marginTop: '2rem',
  },
})

const Article = styled('article', {
  '--text-sans': 'Inter',
  '--text-serif': 'var(--text-sans)',
  '--text-mono': 'DM Mono',

  fontFamily: 'var(--text-sans)',

  paddingTop: '12rem',
  display: 'grid',
  gridTemplateColumns: '1fr 60ch 1fr',

  '> *': {
    marginBottom: '1.5rem',
    gridColumn: '2 / span 1',
  },

  '> .full-width': {
    gridColumn: '1 / -1',
  },

  '> h2': {
    fontSize: '2rem',
    marginTop: '3rem',
    marginBottom: '2rem',
  },

  '> h3': {
    fontSize: '1.5rem',
    marginTop: '1.5rem',
  },

  '> figure': {
    marginTop: '3rem',
    marginBottom: '4.5rem',
  },

  '> blockquote': {
    paddingLeft: '20px',
    color: 'var(--gray600)',
    borderLeft: '3px solid var(--teal)',
  },
})
