import Link from 'next/link'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { titleCase } from 'title-case'
import { HiArrowRight } from 'react-icons/hi'

import { styled } from '@/stitches'
import { formatPath } from '@/lib/utils'

import { frontMatter as post1 } from './aoc-day-1.mdx'
import { frontMatter as post2 } from './parsing-console-log.mdx'
import { frontMatter as post3 } from './tokenizer.mdx'

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
        <Post post={post1} />
        <Post post={post2} />
        <Post post={post3} />
      </Posts>
    </Page>
  )
}

// --

function Post({ post }: { post: typeof post1 }) {
  return (
    <PostWrapper>
      <Link href={formatPath(post.__resourcePath)}>
        <Anchor>
          <Arrow style={{ rotate: -45 }}>
            <HiArrowRight />
          </Arrow>
          <PostTitle>{titleCase(post.title)}</PostTitle>
        </Anchor>
      </Link>
    </PostWrapper>
  )
}

const PostWrapper = styled('li', {})

const Arrow = styled(motion.span, {
  position: 'absolute',
  top: '$2',
  right: '$2',
})

const Anchor = styled('a', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'flex-end',
  borderRadius: 8,
  background: '$grey200',
  padding: '$4',
  border: '2px solid $grey200',
  height: '100%',
  position: 'relative',

  '&:hover': {
    border: '2px solid $black',
    background: '$grey100',
  },
})

const PostTitle = styled('h1', {
  fontWeight: '500',
  fontSize: '$xl',
  fontFamily: '$serif',
  lineHeight: 1,
})

// --

const Posts = styled('ul', {
  display: 'grid',
  gap: '$2',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridAutoRows: '15rem',

  '@md': {
    gap: '$4',
    gridTemplateColumns: 'repeat(3, 1fr)',
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
