import Head from 'next/head'
import tw, { styled, theme } from 'twin.macro'
import { MDXProvider } from '@mdx-js/react'

import CodeBlock from '@/elements/CodeBlock'
import ThematicBreak from '@/elements/ThematicBreak'
import ExternalLink from '@/elements/ExternalLink'
import InlineCode from '@/elements/InlineCode'
import UnorderedList from '@/elements/UnorderedList'
import OrderedList from '@/elements/OrderedList'
import Heading from '@/elements/Heading'
import Subheading from '@/elements/Subheading'
import ProblemStatement from '@/elements/ProblemStatement'
import { PageList } from '@/components/compiler/PageList'

import { formatPath } from '@/lib/utils'

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

export default function Layout({ frontMatter = {}, children }) {
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
        <header>
          <Title>{frontMatter.title}</Title>
          <Blurb>{frontMatter.blurb}</Blurb>
        </header>
        {children}
      </Article>
    </MDXProvider>
  )
}

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
  width: 100%;
  padding-top: 10rem;
  padding-bottom: 40vh;
  grid-template-columns: 2rem 1fr 2rem;
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

  > ${Heading} {
    margin-top: 80px;
    margin-bottom: 32px;
  }

  > ${Subheading} {
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

  font-weight: 600;
  line-height: 1;
  font-size: 4rem;
`
