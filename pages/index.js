import Head from 'next/head'
import Link from 'next/link'
import tw, { styled } from 'twin.macro'
import { HiArrowRight } from 'react-icons/hi'

import ExternalLink from '@/elements/ExternalLink'
import { formatPath } from '@/lib/utils'

import { frontMatter as slidingWindow } from './sliding-window.mdx'
import { frontMatter as debuggerPost } from './debugger.mdx'

const posts = [debuggerPost, slidingWindow]

export default function HomePage() {
  posts.sort((a, b) => (new Date(a.editedAt) < new Date(b.editedAt) ? 1 : -1))
  return (
    <>
      <Head>
        <title>Not a Number</title>
      </Head>
      <div tw="py-32">
        <header className="mx-auto mb-24 space-y-16">
          <Title tw="mx-auto">Not a Number</Title>
          <p tw="text-center max-w-2xl mx-auto px-8 font-serif text-2xl">
            An interactive blog on computer science and web development, by
            {` `}
            <ExternalLink href="https://narendras.io">
              Nanda Syahrasyad
            </ExternalLink>
            .
          </p>
          <p tw="text-center px-16">
            Read the latest below, or{' '}
            <SubscribeButton>subscribe</SubscribeButton> to get it straight in
            your inbox.
          </p>
        </header>
        <Posts>
          <Divider />
          {posts.map(({ title, __resourcePath, description, editedAt }) => (
            <li
              key={__resourcePath}
              tw="px-8 py-4 hover:bg-gray-200 rounded-xl"
            >
              <Link href={formatPath(__resourcePath)}>
                <a tw="flex items-center justify-between cursor-pointer space-x-8">
                  <div tw="space-y-4">
                    <h1 tw="text-3xl font-serif">{title}</h1>
                    <p tw="text-gray-600">{description}</p>
                    <p tw="text-sm text-gray-600">
                      Last updated{' '}
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'long',
                        year: 'numeric',
                        day: 'numeric',
                      }).format(new Date(editedAt))}
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

const SubscribeButton = styled.button`
  position: relative;
  color: var(--color-highlight);
  font-weight: 600;

  --offset: 0px;

  &:after {
    content: '';
    width: 100%;
    position: absolute;
    height: 2px;
    bottom: 0;
    background: currentColor;
    left: 0;
    transform: translateY(var(--offset, 0px));
    transition: transform 0.2s ease-out;
  }

  &:hover {
    --offset: 4px;
  }
`

const Title = styled.h1`
  ${tw`font-serif text-center`}
  font-size: 6rem;
  line-height: 0.9;
`

const Posts = styled.ul`
  ${tw`pt-12 space-y-4`}
  display: grid;
  grid-template-columns: 1fr min(65ch, 100%) 1fr;
  position: relative;

  > * {
    grid-column: 2;
  }

  > :last-child {
    margin-top: 3rem !important;
  }
`

const Divider = styled.div`
  ${tw`absolute top-0 w-24 h-px col-start-1 transform -translate-x-1/2 bg-gray-400 left-1/2`}
  grid-column: 1;
`
