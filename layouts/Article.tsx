import Head from 'next/head'
import Link from 'next/link'
import { HiArrowLeft } from 'react-icons/hi'
import { motion } from 'framer-motion'

import { styled } from '@/stitches'
import NewsletterForm from '@/components/NewsletterForm'

type ArticleLayoutProps = {
  title: string
  content: string
  date: string
  backTo: {
    href: string
    name: string
  }
}

export function ArticleLayout({
  title,
  content,
  date,
  backTo,
}: ArticleLayoutProps) {
  return (
    <Page>
      <Head>
        <title>{title}</title>
      </Head>
      <Link href={backTo.href}>
        <LetterLink whileHover="hover">
          <motion.span variants={{ hover: { x: -5 } }}>
            <HiArrowLeft />
          </motion.span>{' '}
          {backTo.name}
        </LetterLink>
      </Link>
      <DateWrapper>
        {new Intl.DateTimeFormat('en-US', {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
        }).format(new Date(date))}
      </DateWrapper>
      <Title>{title}</Title>
      <Article dangerouslySetInnerHTML={{ __html: content }} />
      <FormWrapper>
        <NewsletterForm />
      </FormWrapper>
    </Page>
  )
}

const DateWrapper = styled('p', {
  color: '$grey600',
  marginTop: '$16',
  marginBottom: '$4',
  fontFamily: '$mono',
  fontSize: '$sm',
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
