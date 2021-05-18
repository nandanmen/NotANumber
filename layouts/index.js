import React from 'react'
import Head from 'next/head'
import tw, { styled, theme } from 'twin.macro'
import { MDXProvider } from '@mdx-js/react'

import FeedbackForm from '@/components/FeedbackForm'
import NewsletterForm from '@/components/NewsletterForm'
import Navigation from '@/components/Navigation'

import CodeBlock from '@/elements/CodeBlock'
import ThematicBreak from '@/elements/ThematicBreak'
import ExternalLink from '@/elements/ExternalLink'
import InlineCode from '@/elements/InlineCode'
import UnorderedList from '@/elements/UnorderedList'
import OrderedList from '@/elements/OrderedList'
import Heading from '@/elements/Heading'
import Subheading from '@/elements/Subheading'
import ProblemStatement from '@/elements/ProblemStatement'

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
        <Header>
          <Title>{frontMatter.title}</Title>
          <Blurb>{frontMatter.blurb}</Blurb>
        </Header>
        <Meta>
          <Author>
            <Avatar src="/avatar.jpg" alt="Nanda Syahrasyad" />
            <p>Nanda Syahrasyad</p>
          </Author>
          <p>Last updated {formatter.format(new Date(frontMatter.editedAt))}</p>
        </Meta>
        {children}
        <FormContainer>
          <FeedbackForm slug={frontMatter.__resourcePath} />
          <NewsletterForm />
        </FormContainer>
      </Article>
      <Footer>
        <Navigation style={{ width: 'min(65ch, 100%)' }} tw="mt-8" />
      </Footer>
    </MDXProvider>
  )
}

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
  ${tw`font-serif text-2xl`}

  text-align: center;
  padding: 0 32px;
`

const Header = styled.header`
  background: var(--color-background);
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100vw;

  @media screen and (min-width: ${theme`screens.lg`}) {
    height: 100vh;
  }
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
  padding-bottom: 80px;
  grid-template-columns: 2rem 1fr 2rem;
  line-height: 1.6;

  > * {
    grid-column: 2 / span 1;
    margin-bottom: 1.5em;
  }

  > ${Header} {
    grid-column: 1 / -1;
  }

  > ${Header}, > ${Meta} {
    margin-bottom: 48px;

    @media screen and (min-width: ${theme`screens.lg`}) {
      margin-bottom: 96px;
    }
  }

  > figure {
    margin-bottom: 2rem;
  }

  > ${CodeBlock} {
    margin-top: 24px;
    margin-bottom: 48px;

    border-radius: 0;
    border-right-width: 0;
    border-left-width: 0;

    grid-column: 1 / -1;
    max-width: 100vw;

    @media screen and (min-width: ${theme`screens.md`}) {
      grid-column: 5 / span 1;

      /* For some reason revert doesn't work here so I have to manually set it back */
      border-radius: 6px;
      border-right-width: 2px;
      border-left-width: 2px;
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
  ${tw`px-8 mx-auto mb-12 font-serif text-center lg:mb-24`}

  font-size: 4rem;
  line-height: 0.9;
  max-width: min(100vw, 14ch);

  @media screen and (min-width: ${theme`screens.md`}) {
    font-size: clamp(5rem, 15vw, 8rem);
  }
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
  background: var(--gray200);
  color: var(--color-text-secondary);
  height: 320px;
`
