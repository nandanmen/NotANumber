import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { HiArrowLeft } from 'react-icons/hi'
import { motion } from 'framer-motion'

import { styled } from '@/stitches'
import {
  getLetterFromSlug,
  getAllLetters,
  processLetterAsHtml,
  Letter,
} from '@/lib/button-down'
import NewsletterForm from '@/components/NewsletterForm'

export default function LetterPage({
  letter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page>
      <Head>
        <title>{letter.subject}</title>
      </Head>
      <Link href="/letters">
        <LetterLink whileHover="hover">
          <motion.span variants={{ hover: { x: -5 } }}>
            <HiArrowLeft />
          </motion.span>{' '}
          Letters
        </LetterLink>
      </Link>
      <DateWrapper>
        {new Intl.DateTimeFormat('en-US', {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
        }).format(new Date(letter.publish_date))}
      </DateWrapper>
      <Title>{letter.subject}</Title>
      <Article dangerouslySetInnerHTML={{ __html: letter.body }} />
      <FormWrapper>
        <NewsletterForm />
      </FormWrapper>
    </Page>
  )
}

export const getStaticProps: GetStaticProps<
  { letter: Letter },
  { slug: string }
> = async ({ params }) => {
  const letter = await getLetterFromSlug(params.slug as string)
  const processedLetter = processLetterAsHtml(letter)
  return {
    props: {
      letter: processedLetter,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const letters = await getAllLetters()
  return {
    paths: letters.map((letter) => `/letters/${letter.key}`),
    fallback: 'blocking',
  }
}

const DateWrapper = styled('p', {
  color: '$grey600',
  marginTop: '$16',
  marginBottom: '$4',
})

const LetterLink = styled(motion.a, {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',

  '&:hover': {
    color: '$blue',
  },

  span: {
    marginRight: '$2',
  },
})

const FormWrapper = styled('div', {
  margin: '$20 auto',
})

const Page = styled('div', {
  padding: '$24 $8',
  maxWidth: 'calc(40rem + $space$16)',
  margin: '0 auto',
})

const Title = styled('h1', {
  fontFamily: '$serif',
  fontSize: '3rem',
  lineHeight: 1,
  fontWeight: 600,
  marginBottom: '$16',
})

const Article = styled('article', {
  ol: {
    counterReset: 'list',
  },

  li: {
    counterIncrement: 'list',
    paddingLeft: '$8',
    position: 'relative',

    '&:before': {
      content: `counters(list, '.') ". "`,
      position: 'absolute',
      left: 0,
      fontFamily: '$mono',
      fontSize: '$sm',
      top: 2,
      color: '$grey600',
    },
  },

  a: {
    color: '$blue',
    textDecoration: 'underline',
  },

  code: {
    background: '$white',
    fontSize: '$sm',
    padding: '$1',
    borderRadius: 4,
  },

  '> h2': {
    fontSize: '$2xl',
    fontWeight: 600,
    fontFamily: '$serif',
    marginTop: '$10',
  },

  '> pre': {
    maxWidth: 'calc(100% + $space$16)',
    overflowX: 'scroll',
    background: '$white',
    padding: '$8',
    borderRadius: '8px',
    margin: '$10 -$8',
    marginBottom: '$10 !important',
    border: '2px solid $grey600',
  },

  '> p > img': {
    marginTop: '$10',
    marginBottom: '$10 !important',
    borderRadius: 8,
  },

  '> hr': {
    marginTop: '$10',
    marginBottom: '$10 !important',
    borderTop: '2px solid $grey200',
  },

  '> :not(:last-child)': {
    marginBottom: '$4',
  },
})
