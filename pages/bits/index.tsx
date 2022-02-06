import Link from 'next/link'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { titleCase } from 'title-case'
import { HiArrowRight } from 'react-icons/hi'
import type { GetStaticProps } from 'next'

import { styled } from '@/stitches'
import { getPublishedBits } from '@/lib/notion'
import type { Bit } from '@/lib/notion'

export default function BitsPage({ posts }: { posts: Bit[] }) {
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
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </Posts>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPublishedBits()
  return {
    props: { posts },
    revalidate: 300, // stale after 5 minutes
  }
}

// --

function Post({ post }: { post: Bit }) {
  return (
    <PostWrapper>
      <Link href={`/bits/${post.id}`}>
        <Anchor>
          <Arrow style={{ rotate: -45 }}>
            <HiArrowRight />
          </Arrow>
          <PostTitle>{titleCase(post.title)}</PostTitle>
          <PostDate>
            {new Intl.DateTimeFormat('en-US', {
              month: 'long',
              year: 'numeric',
              day: 'numeric',
            }).format(new Date(post.lastEditedAt))}
          </PostDate>
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

const PostDate = styled('p', {
  color: '$grey600',
  fontFamily: '$mono',
  marginTop: '$2',
  fontSize: '$sm',
})

const Anchor = styled('a', {
  cursor: 'pointer',
  display: 'block',
  borderRadius: 8,
  padding: '$6',
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
