import Head from 'next/head'
import { styled } from '@/stitches'
import { red } from '@radix-ui/colors'

export default function LettersPage() {
  return (
    <Page>
      <Head>
        <title>NaN | Letters</title>
      </Head>
      <Header>
        <Title>Letters</Title>
        <Blurb>
          An archive of letters from the Not a Number newsletter, amped up with
          interactive components. <SubscribeLink>Subscribe</SubscribeLink> to
          get these letters sent straight to your inbox.
        </Blurb>
      </Header>
      <List>
        <Letter
          title="CSS Counters and a Warm Hello"
          description="In Not a Number's first ever newsletter, we talk about CSS counters: what they are, and how to use them."
          date={new Date()}
        />
      </List>
    </Page>
  )
}

const SubscribeLink = styled('a', {
  color: red.red10,
  fontFamily: '$serif',
  fontStyle: 'italic',
  fontWeight: 600,
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

const List = styled('ul', {
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
