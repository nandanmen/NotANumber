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
import Heading from '@/elements/Heading'
import Subheading from '@/elements/Subheading'

import { formatPath } from '@/lib/utils'

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  day: 'numeric',
})

const mdxComponents = {
  a: ExternalLink,
  pre: (props) => <div {...props} />,
  code: CodeBlock,
  hr: ThematicBreak,
  inlineCode: InlineCode,
  ul: UnorderedList,
  ol: OrderedList,
  h2: Heading,
  h3: Subheading,
}

interface Post {
  __resourcePath: string
  title: string
  blurb: string
  description: string
  editedAt: string
  publishedAt: string | null
}

type LayoutProps = {
  frontMatter: Post
  children: React.ReactNode
}

export default function RedesignLayout({
  frontMatter = {} as Post,
  children,
}: LayoutProps) {
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
          <PostUpdatedDate>
            Last updated {formatter.format(new Date(frontMatter.editedAt))}
          </PostUpdatedDate>
        </Header>
        {children}
      </Article>
    </MDXProvider>
  )
}

const Header = styled('header', {
  '> :not(:last-child)': {
    marginBottom: '$8',
  },
})

const Title = styled('h1', {
  fontSize: '4rem',
  fontFamily: 'Cal Sans',
  lineHeight: 1,

  '@md': {
    fontSize: '6rem',
  },
})

const PostUpdatedDate = styled('p', {
  color: '$slate10',
})

const Article = styled('article', {
  fontFamily: '$sans',
  width: 'min(calc(65ch + $space$16), 100vw)',
  margin: '$24 auto',
  padding: '0 $8',
  lineHeight: 1.7,

  '> :not(:last-child)': {
    marginBottom: '$8',
  },

  [`> ${Heading}`]: {
    marginTop: '$32',
  },

  [`> ${Header}`]: {
    marginBottom: '$24',
  },

  [`> ${Subheading}`]: {
    marginTop: '$16',
  },

  '@md': {
    [`> ${Header}`]: {
      marginBottom: '$32',
    },
  },
})
