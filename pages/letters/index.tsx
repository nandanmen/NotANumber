import React from 'react'
import { HiArrowRight, HiCheck } from 'react-icons/hi'
import { ImSpinner8 } from 'react-icons/im'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { styled } from '@/stitches'
import { blue, green } from '@radix-ui/colors'
import { subscribe } from '@/lib/subscribe'

export default function LettersPage() {
  const [isSubscribeInputOpen, setIsSubscribeInputOpen] = React.useState(false)
  const [formState, setFormState] = React.useState('idle')

  return (
    <Page>
      <Head>
        <title>NaN | Letters</title>
      </Head>
      <Header>
        <Title>Letters</Title>
        <Blurb>
          An archive of letters from the Not a Number newsletter, amped up with
          interactive components.{' '}
          <SubscribeLink onClick={() => setIsSubscribeInputOpen(true)}>
            Subscribe
          </SubscribeLink>{' '}
          to get these letters sent straight to your inbox.
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
        <Letter
          title="CSS Counters and a Warm Hello"
          description="In Not a Number's first ever newsletter, we talk about CSS counters: what they are, and how to use them."
          date={new Date()}
        />
      </List>
    </Page>
  )
}

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
  padding: '$8',
  paddingTop: '$24',

  '@md': {
    padding: '$16',
    paddingTop: '$32',
  },
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
  fontWeight: 600,
})

const Blurb = styled('p', {
  color: '$grey600',
  maxWidth: '65ch',
})

const List = styled(motion.ul, {
  listStyle: 'none',
  counterReset: 'letters',
})

function Letter({ title, description = '', date = new Date() }) {
  return (
    <LetterWrapper>
      <LetterDate>
        {date.getDate()}/{date.getMonth() + 1}
      </LetterDate>
      <LetterTitle>{title}</LetterTitle>
      <LetterDescription>{description}</LetterDescription>
    </LetterWrapper>
  )
}

const LetterWrapper = styled('li', {
  counterIncrement: 'letters',
  position: 'relative',
  maxWidth: '70ch',

  '@md': {
    paddingLeft: '$16',
  },
})

const LetterTitle = styled('h1', {
  fontFamily: '$serif',
  fontWeight: 600,
  fontSize: '2.5rem',
  lineHeight: 1,
  marginBottom: '$4',
})

const LetterDate = styled('p', {
  fontFamily: '$serif',
  fontWeight: 600,
  color: '$grey600',
  fontSize: '$lg',
  marginBottom: '$4',

  '@md': {
    position: 'absolute',
    left: 0,
  },
})

const LetterDescription = styled('p', {})
