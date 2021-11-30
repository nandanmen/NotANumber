import React from 'react'
import Link from 'next/link'
import { HiArrowLeft } from 'react-icons/hi'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { styled } from '@/stitches'

export default function BitsPage() {
  return (
    <Page>
      <Head>
        <title>NaN | Bits</title>
      </Head>
      <Header>
        <Link href="/">
          <BackLink whileHover="hover">
            <motion.span variants={{ hover: { x: -5 } }}>
              <HiArrowLeft />
            </motion.span>{' '}
            Home
          </BackLink>
        </Link>
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
        <Blurb>A small collection of little learnings ✨</Blurb>
      </Header>
    </Page>
  )
}

const BackLink = styled(motion.a, {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: '$grey600',

  '&:hover': {
    color: '$blue',
  },

  span: {
    marginRight: '$2',
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

const Blurb = styled('p', {})
