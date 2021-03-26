import Head from 'next/head'
import Link from 'next/link'
import tw, { styled } from 'twin.macro'
import { HiArrowRight } from 'react-icons/hi'

import { frontMatter as slidingWindow } from './sliding-window.mdx'
import { frontMatter as debuggerCodeAnalysis } from './building-a-debugger-code-analysis.mdx'

const posts = [slidingWindow, debuggerCodeAnalysis]

function formatPath(path) {
  return path.replace(/\.mdx$/, '')
}

export default function HomePage() {
  posts.sort((a, b) =>
    new Date(a.publishDate) < new Date(b.publishDate) ? 1 : -1
  )
  return (
    <>
      <Head>
        <title>Not a Number</title>
      </Head>
      <div tw="pb-32 dark:text-white">
        <header className="pt-32 mx-auto mb-24">
          <Title tw="mx-auto mb-16">Not a Number</Title>
          <p tw="text-center max-w-md mx-auto px-8">
            An interactive blog on computer science and web development, by
            {` `}
            <ExternalLink
              href="https://narendras.io"
              target="_blank"
              rel="noreferrer"
            >
              Nanda Syahrasyad
            </ExternalLink>
            .
          </p>
        </header>
        <Posts>
          <Divider />
          {posts.map(({ title, __resourcePath, blurb, publishDate }) => (
            <li
              key={__resourcePath}
              tw="px-8 py-4 hover:bg-gray-200 rounded-xl dark:hover:bg-blacks-500"
            >
              <Link href={formatPath(__resourcePath)}>
                <a tw="flex items-center justify-between cursor-pointer">
                  <div tw="space-y-2">
                    <h1 tw="text-3xl font-semibold font-serif">{title}</h1>
                    <p tw="italic">{blurb}</p>
                    <p tw="text-sm text-gray-600 dark:text-gray-300">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'long',
                        year: 'numeric',
                        day: 'numeric',
                      }).format(new Date(publishDate))}
                    </p>
                  </div>
                  <p tw="text-2xl text-gray-600 dark:text-gray-300">
                    <HiArrowRight />
                  </p>
                </a>
              </Link>
            </li>
          ))}
        </Posts>
      </div>
    </>
  )
}

const Title = styled.h1`
  ${tw`font-serif font-semibold text-center`}
  font-size: clamp(5rem, 8vw, 8rem);
  line-height: 0.9;
`

const ExternalLink = tw.a`font-semibold text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-300`

const Posts = styled.ul`
  ${tw`pt-12 space-y-4`}

  display: grid;
  grid-template-columns: 1fr min(65ch, 100%) 1fr;
  position: relative;

  > * {
    grid-column: 2;
  }
`

const Divider = styled.div`
  ${tw`absolute top-0 w-24 h-px col-start-1 transform -translate-x-1/2 bg-gray-400 left-1/2`}

  grid-column: 1;
`
