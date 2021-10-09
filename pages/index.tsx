import Head from 'next/head'
import Link from 'next/link'
import { styled } from '@/stitches'
import { HiArrowRight } from 'react-icons/hi'

import { DebuggerIcon } from '@/components/debugger/DebuggerIcon'
import { SlidingWindowIcon } from '@/components/sliding-window/SlidingWindowIcon'
import ExternalLink from '@/elements/ExternalLink'
import { formatPath } from '@/lib/utils'

import { frontMatter as slidingWindow } from './sliding-window.mdx'
import { frontMatter as debuggerPost } from './debugger.mdx'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Not a Number</title>
      </Head>
      <Wrapper>
        <Header>
          <Title>Not a Number</Title>
          <Description>
            An interactive blog on computer science and web development, by
            {` `}
            <ExternalLink href="https://narendras.io">
              Nanda Syahrasyad
            </ExternalLink>
            .
          </Description>
        </Header>
        <Divider />
        <Posts>
          <PostItem>
            <Icon>
              <DebuggerIcon />
            </Icon>
            <Post post={debuggerPost} />
          </PostItem>
          <PostItem>
            <Icon>
              <SlidingWindowIcon />
            </Icon>
            <Post post={slidingWindow} />
          </PostItem>
        </Posts>
      </Wrapper>
    </>
  )
}

const Icon = styled('div', {
  display: 'none',

  '@post': {
    display: 'revert',
  },
})

const PostItem = styled('li', {
  '@post': {
    display: 'grid',
    gridTemplateColumns: '8rem 40rem',
    alignItems: 'center',
    gap: '$4',
  },
})

const Wrapper = styled('div', {
  paddingTop: '$32',
  paddingBottom: '$32',
})

const Title = styled('h1', {
  fontFamily: '$serif',
  textAlign: 'center',
  fontSize: '6rem',
  fontWeight: '600',
  lineHeight: '0.9',
})

const Header = styled('header', {
  marginBottom: '$16',
  textAlign: 'center',

  '> :not(:last-child)': {
    marginBottom: '$16',
  },
})

const Description = styled('p', {
  fontSize: '$xl',
  paddingLeft: '$8',
  paddingRight: '$8',
  maxWidth: '720px',
  margin: '0 auto',
})

const Posts = styled('ul', {
  paddingTop: '$12',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  '> :not(:last-child)': {
    marginBottom: '$4',
  },
})

const Divider = styled('div', {
  width: '$24',
  height: '$px',
  background: '$grey400',
  transform: 'translateX(calc(50vw - 50%))',
})

// --

function Post({ post }: { post: typeof slidingWindow }) {
  return (
    <PostWrapper>
      <Link href={formatPath(post.__resourcePath)}>
        <Anchor>
          <PostContent>
            <PostTitle>{post.title}</PostTitle>
            <PostDescription>{post.description}</PostDescription>
            <PostUpdatedText>
              Last updated{' '}
              {new Intl.DateTimeFormat('en-US', {
                month: 'long',
                year: 'numeric',
                day: 'numeric',
              }).format(new Date(post.editedAt))}
            </PostUpdatedText>
          </PostContent>
          <PostArrow>
            <HiArrowRight />
          </PostArrow>
        </Anchor>
      </Link>
    </PostWrapper>
  )
}

const PostWrapper = styled('div', {
  padding: '$4 $8',
  borderRadius: '12px',
  width: 'min(100vw, 40rem)',

  '&:hover': {
    background: '$grey200',
  },
})

const Anchor = styled('a', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',

  '> :not(:last-child)': {
    marginRight: '$8',
  },
})

const PostTitle = styled('h1', {
  fontWeight: '500',
  fontSize: '$2xl',
  fontFamily: '$serif',
})

const PostDescription = styled('p', {
  color: '$grey600',
})

const PostUpdatedText = styled('p', {
  fontSize: '$sm',
  color: '$grey600',
})

const PostArrow = styled('p', {
  fontSize: '$xl',
  color: '$grey600',
})

const PostContent = styled('div', {
  '> :not(:last-child)': {
    marginBottom: '$4',
  },
})
