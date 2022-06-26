import React from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { HiArrowRight, HiCheck, HiArrowLeft } from 'react-icons/hi'
import { ImSpinner8 } from 'react-icons/im'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { styled } from '@/stitches'
import { blue, green } from '@radix-ui/colors'
import { subscribe } from '@/lib/subscribe'
import { getAllLetters, Letter } from '@/lib/button-down'

type LetterPageProps = {
  letters: Letter[]
}

export default function LettersPage({ letters }: LetterPageProps) {
  const [isSubscribeInputOpen, setIsSubscribeInputOpen] = React.useState(false)
  const [formState, setFormState] = React.useState('idle')
  const emailInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (isSubscribeInputOpen && emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }, [isSubscribeInputOpen])

  return (
    <Page>
      <Head>
        <title>NaN | Letters</title>
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
        <Title>Letters</Title>
        <Blurb>
          An archive of letters from the Not a Number newsletter.{' '}
          <SubscribeLink onClick={() => setIsSubscribeInputOpen(true)}>
            Subscribe
          </SubscribeLink>{' '}
          now to get these letters sent straight to your inbox.
        </Blurb>
        {isSubscribeInputOpen && (
          <SubscriptionBox
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: -8, opacity: 0 }}
            onSubmit={(evt: React.FormEvent<HTMLFormElement>) => {
              evt.preventDefault()
              const target = evt.target as typeof evt.target & {
                email: { value: string }
              }
              const email = target.email.value
              setFormState('loading')
              subscribe(email).then(() => setFormState('done'))
            }}
          >
            <EmailInput
              ref={emailInputRef}
              name="email"
              type="email"
              placeholder="john.doe@email.com"
            />
            <SubmitButton
              variants={{
                loading: {
                  scale: 0.8,
                },
              }}
              animate={formState}
              whileTap="loading"
              done={formState === 'done'}
            >
              {formState === 'idle' ? (
                <HiArrowRight size="1.5em" />
              ) : formState === 'loading' ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ImSpinner8 size="1.2em" />
                </motion.span>
              ) : (
                <HiCheck size="1.5em" />
              )}
            </SubmitButton>
          </SubscriptionBox>
        )}
      </Header>
      <List layout>
        {letters.map((letter) => (
          <LetterLink
            key={letter.key}
            title={letter.subject}
            date={new Date(letter.publish_date)}
            slug={letter.key}
          />
        ))}
      </List>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      letters: await getAllLetters(),
    },
  }
}

const BackLink = styled(motion.a, {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  fontFamily: '$mono',

  '&:hover': {
    color: '$blue',
  },

  span: {
    marginRight: '$2',
  },
})

const SubscribeLink = styled('button', {
  color: blue.blue10,
  fontFamily: '$serif',
  fontStyle: 'italic',
  fontWeight: 600,
})

const SubscriptionBox = styled(motion.form, {
  marginTop: '$4',
  display: 'flex',
  gap: '$2',
  maxWidth: '20rem',
})

const SubmitButton = styled(motion.button, {
  width: '44px',
  borderRadius: '6px',
  background: blue.blue10,
  aspectRatio: 1,
  color: '$white',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    done: {
      true: {
        background: green.green10,
      },
    },
  },
})

const EmailInput = styled('input', {
  borderRadius: '6px',
  padding: '$2',
  border: '2px solid $grey300',
  outline: 'none',
  width: '100%',

  '&:focus-visible': {
    border: `2px solid ${blue.blue10}`,
  },
})

const Page = styled('div', {
  padding: '$24 $8',
  maxWidth: 'calc(40rem + $space$16)',
  margin: '0 auto',
})

const Header = styled('header', {
  marginBottom: '$12',

  '@md': {
    marginBottom: '$20',
  },
})

const Title = styled('h1', {
  fontFamily: '$serif',
  fontSize: '4rem',
  marginBottom: '$6',
  marginTop: '$16',
})

const Blurb = styled('p', {
  maxWidth: '65ch',
})

const List = styled(motion.ul, {
  listStyle: 'none',
  counterReset: 'letters',

  '> :not(:last-child)': {
    marginBottom: '$8',
  },
})

function LetterLink({ title, date = new Date(), slug }) {
  return (
    <LetterWrapper>
      <LetterDate>
        {new Intl.DateTimeFormat('en-US', {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
        }).format(date)}
      </LetterDate>
      <Link href={`/letters/${slug}`}>
        <LetterTitle>
          {title}{' '}
          <span>
            <HiArrowRight />
          </span>
        </LetterTitle>
      </Link>
    </LetterWrapper>
  )
}

const LetterWrapper = styled('li', {
  counterIncrement: 'letters',
  position: 'relative',
  maxWidth: '70ch',
})

const LetterTitle = styled('a', {
  fontFamily: '$serif',
  fontSize: '$2xl',
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',

  span: {
    marginLeft: 'auto',
  },

  '&:hover': {
    color: '$blue',
  },
})

const LetterDate = styled('p', {
  color: '$grey600',
  marginBottom: '$4',
  fontFamily: '$mono',
  fontSize: '$sm',
})
