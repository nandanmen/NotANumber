import Head from 'next/head'
import Link from 'next/link'
import tw, { styled } from 'twin.macro'
import { HiArrowRight } from 'react-icons/hi'

import posts from '../posts'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Not a Number</title>
      </Head>
      <div tw="pb-32">
        <header className="mx-auto mt-32 mb-24">
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
          {posts.map(({ title, slug, blurb, publishDate }) => (
            <li key={slug} tw="px-8 py-4 hover:bg-gray-200 rounded-xl">
              <Link href={slug}>
                <a tw="flex items-center justify-between cursor-pointer">
                  <div tw="space-y-2">
                    <h1 tw="text-3xl font-semibold font-serif">{title}</h1>
                    <p tw="italic">{blurb}</p>
                    <p tw="text-sm text-gray-600">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'long',
                        year: 'numeric',
                        day: 'numeric',
                      }).format(new Date(publishDate))}
                    </p>
                  </div>
                  <p tw="text-2xl text-gray-600">
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

const ExternalLink = tw.a`font-semibold text-gray-700 hover:text-green-600`

const Posts = styled.ul`
  ${tw`pt-12`}

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
