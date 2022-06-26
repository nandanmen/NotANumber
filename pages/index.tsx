import Head from 'next/head'
import Link from 'next/link'
import { styled } from '@/stitches'
import { HiArrowRight } from 'react-icons/hi'
import { titleCase } from 'title-case'
import { motion } from 'framer-motion'

import { DebuggerIcon } from '@/components/debugger/DebuggerIcon'
import { SlidingWindowIcon } from '@/components/sliding-window/SlidingWindowIcon'
import { HowArraysWorkIcon } from '@/components/how-arrays-work/HowArraysWorkIcon'
import { formatPath } from '@/lib/utils'
import { Svg } from '@/components/Svg'

import { frontMatter as slidingWindow } from './sliding-window.mdx'
import { frontMatter as debuggerPost } from './debugger.mdx'
import { frontMatter as howArraysWork } from './how-arrays-work.mdx'
import { frontMatter as tokenizer } from './tokenizer.mdx'

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
            Nanda Syahrasyad.
          </Description>
          <p>
            <Link href="letters">
              <NewsletterLink whileHover="hover">
                Read the newsletter{' '}
                <motion.span variants={{ hover: { x: 5 } }}>
                  <HiArrowRight />
                </motion.span>
              </NewsletterLink>
            </Link>
          </p>
        </Header>
        <Divider />
        <Posts>
          <PostItem>
            <Icon>
              <Svg href="tokenizer/logo.svg" />
            </Icon>
            <Post post={tokenizer} />
          </PostItem>
          <PostItem>
            <Icon>
              <HowArraysWorkIcon />
            </Icon>
            <Post post={howArraysWork} />
          </PostItem>
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

const NewsletterLink = styled(motion.a, {
  fontFamily: '$mono',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',

  '&:hover': {
    textDecoration: 'underline',
  },

  '> span': {
    marginLeft: '$2',
  },
})

const Icon = styled('div', {
  display: 'none',

  '@post': {
    display: 'revert',
  },
})

const PostItem = styled('li', {
  margin: '0 -2rem',
  width: '100vw',

  '@post': {
    display: 'grid',
    gridTemplateColumns: '8rem 1fr',
    alignItems: 'center',
    gap: '$8',
    margin: 'revert',
    width: '100%',
  },
})

const Wrapper = styled('div', {
  padding: '$32 0',
})

const Title = styled('h1', {
  fontFamily: '$serif',
  fontSize: '5rem',
  lineHeight: '0.9',
  marginBottom: '$16',

  '@md': {
    fontSize: '6rem',
  },
})

const Header = styled('header', {
  marginBottom: '$16',
})

const Description = styled('p', {
  fontSize: '$lg',
  maxWidth: '45ch',
  marginBottom: '$8',
})

const Posts = styled('ul', {
  paddingTop: '$12',
})

const Divider = styled('div', {
  width: 'min(30vw, $space$24)',
  marginLeft: '-2rem',
  height: '$px',
  background: '$grey400',

  '@media screen and (min-width: 60rem)': {
    marginLeft: 0,
  },
})

// --

function Post({ post }: { post: typeof slidingWindow }) {
  return (
    <PostWrapper>
      <Link href={formatPath(post.__resourcePath)}>
        <Anchor>
          <PostContent>
            <PostTitle>{titleCase(post.title)}</PostTitle>
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
  padding: '$8',

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
  fontSize: '$2xl',
  fontFamily: '$serif',
  lineHeight: '1.1'
})

const PostDescription = styled('p', {
  color: '$grey600',
})

const PostUpdatedText = styled('p', {
  fontSize: '$sm',
  color: '$grey600',
  fontFamily: '$mono',
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
