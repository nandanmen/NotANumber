import React from 'react'
import Head from 'next/head'
import tw, { styled, theme } from 'twin.macro'
import { MDXProvider } from '@mdx-js/react'

import FeedbackForm from '../components/FeedbackForm'
import NewsletterForm from '../components/NewsletterForm'
import Navigation from '../components/Navigation'
import CodeBlock from '../components/elements/CodeBlock'
import ThematicBreak from '../components/elements/ThematicBreak'
import ExternalLink from '../components/elements/ExternalLink'

export default function Layout({ frontMatter = {}, children }) {
  return (
    <MDXProvider
      components={{ a: ExternalLink, pre: CodeBlock, hr: ThematicBreak }}
    >
      <Article>
        <Head>
          <title>{frontMatter.title}</title>
        </Head>
        <Header>
          <Title>{frontMatter.title}</Title>
          <p tw="italic font-semibold text-center px-8 text-gray-600">
            {frontMatter.blurb}
          </p>
        </Header>
        <div tw="flex items-center justify-between mb-12! text-sm text-gray-600 dark:text-gray-100">
          <div tw="flex items-center">
            <img
              src="/avatar.jpg"
              alt="Nanda Syahrasyad"
              tw="object-cover w-8 h-8 mr-2 border-2 border-gray-400 rounded-full"
            />
            <p>Nanda Syahrasyad</p>
          </div>
          <p>
            {new Intl.DateTimeFormat('en-US', {
              month: 'long',
              year: 'numeric',
              day: 'numeric',
            }).format(new Date(frontMatter.publishDate || new Date()))}
          </p>
        </div>
        {children}
        <FormContainer>
          <FeedbackForm slug={frontMatter.__resourcePath} />
          <NewsletterForm />
        </FormContainer>
      </Article>
      <footer tw="flex justify-center px-8 pt-64 pb-24 bg-gray-200 h-80 dark:bg-blacks-500">
        <Navigation
          style={{ width: 'min(65ch, 100%)' }}
          tw="mt-8 text-gray-500 dark:text-gray-200"
        />
      </footer>
    </MDXProvider>
  )
}

const Header = styled.header`
  ${tw`mb-12! bg-gradient-to-b from-gray-200 to-gray-100 lg:h-screen lg:mb-24! dark:(text-white from-blacks-900 to-blacks-700)`}

  height: 600px;
  grid-column: 1 / -1 !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100vw;
`

const Article = styled.article`
  ${tw`grid w-full pb-20 text-gray-900 dark:text-white`}

  grid-template-columns: 2rem 1fr 2rem;
  line-height: 1.6;

  > * {
    grid-column: 2 / span 1;
    margin-bottom: 1.5em;
  }

  > figure {
    margin-bottom: 2rem;
  }

  > ${CodeBlock} {
    margin-top: 8px;
    margin-bottom: 32px;
  }

  > ${ThematicBreak} {
    margin-top: 24px;
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

  h2 {
    ${tw`relative mt-16 font-serif text-3xl`}
    margin-bottom: 1em;

    &:before {
      ${tw`absolute left-0 w-6 bg-green-500 -top-4 dark:bg-green-800`}
      content: '';
      height: 3px;
    }
  }

  h3 {
    ${tw`mt-8 text-xl text-gray-800 dark:text-current`}
    margin-bottom: 1em;
  }

  > ul,
  > ol {
    ${tw`pl-4 space-y-2`}
  }

  ul {
    ${tw`list-disc`}
  }

  ol {
    ${tw`list-decimal`}
  }

  code {
    ${tw`p-1 bg-gray-200 rounded-sm dark:bg-blacks-500`}
    font-size: 0.875em;
  }

  > pre {
    grid-column: 1 / -1;
    max-width: 100vw;

    @media screen and (min-width: 770px) {
      grid-column: 5 / span 1;
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
