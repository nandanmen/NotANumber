import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { HiArrowRight } from 'react-icons/hi'
import { motion } from 'framer-motion'
import { titleCase } from 'title-case'

import { styled } from '@/stitches'
import { formatPath } from '@/lib/utils'

import { frontMatter as aocDay1 } from './2021-11-30-aoc-day-01.mdx'

export default function BitsPage() {
  return (
    <Page>
      <Head>
        <title>NaN | Bits</title>
      </Head>
      <Header>
        <Title>
          <Node>
            <Content>B</Content>
          </Node>
          <Node style={{ y: -8 }}>
            <Content>i</Content>
          </Node>
          <Node style={{ y: 6 }}>
            <Content>t</Content>
          </Node>
          <Node>
            <Content>s</Content>
          </Node>
        </Title>
        <Blurb>A small collection of little learnings</Blurb>
      </Header>
      <Divider />
      <Posts>
        <Post post={aocDay1} />
      </Posts>
    </Page>
  )
}

// --

function Post({ post }: { post: typeof aocDay1 }) {
  return (
    <PostWrapper>
      <Link href={formatPath(post.__resourcePath)}>
        <Anchor>
          <PostContent>
            <PostTitle>{titleCase(post.title)}</PostTitle>
            {post.description && (
              <PostDescription>{post.description}</PostDescription>
            )}
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
  borderRadius: '12px',

  '&:hover': {
    background: '$grey200',
  },

  '@md': {
    padding: '$4 $8',
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

// --

const Posts = styled('ul', {
  '> :not(:last-child)': {
    marginBottom: '$4',
  },
})

const Node = styled(motion.span, {
  $$borderRadius: '$sizes$2',
  display: 'block',

  width: '$20',
  height: '$20',
  position: 'relative',

  '&:before': {
    content: '',
    position: 'absolute',
    background: `repeating-linear-gradient(
      -45deg,
      $colors$black,
      $colors$black 3px,
      transparent 3px,
      transparent 5px
    )`,
    inset: '$0',
    transform: 'translate(3px, 6px)',
    borderRadius: '$$borderRadius',
  },
})

const Content = styled('span', {
  position: 'absolute',
  inset: '$0',
  background: '$background',
  border: '3px solid $black',
  borderRadius: '$$borderRadius',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
})

const Page = styled('div', {
  padding: '$24 $8',
  maxWidth: 'calc(40rem + $space$16)',
  margin: '0 auto',
})

const Header = styled('header', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '$12',

  '@md': {
    marginBottom: '$20',
  },
})

const Title = styled('h1', {
  fontFamily: '$serif',
  fontSize: '2.5rem',
  fontWeight: 600,
  marginBottom: '$16',
  marginTop: '$16',
  display: 'flex',

  '> :not(:last-child)': {
    marginRight: '$2',
  },
})

const Blurb = styled('p', {
  fontStyle: 'italic',
  fontFamily: '$serif',
})

const Divider = styled('div', {
  width: '$24',
  height: '$px',
  background: '$grey400',
  margin: '0 auto',
  marginBottom: '$12',

  '@md': {
    marginBottom: '$20',
  },
})
