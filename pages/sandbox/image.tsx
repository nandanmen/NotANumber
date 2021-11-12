import { styled } from '@/stitches'

const page = {
  title: 'How Do Arrays Work?',
  blurb: "Rebuilding the world's most popular data structure.",
}

export default function OgImagePage() {
  return (
    <Main>
      <Title>{page.title}</Title>
      <Blurb>{page.blurb}</Blurb>
      <Author>
        <Avatar src="/avatar.jpg" alt="Nanda Syahrasyad" />
        <p>Nanda Syahrasyad</p>
      </Author>
    </Main>
  )
}

const Main = styled('main', {
  padding: '$32',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

const Title = styled('h1', {
  fontSize: '8rem',
  fontFamily: '$serif',
  fontWeight: '600',
  lineHeight: 1,
  marginBottom: '$24',
  textAlign: 'center',
  maxWidth: '52rem',
})

const Blurb = styled('p', {
  fontFamily: '$sans',
  fontSize: '$2xl',
  marginBottom: '$24',
})

const Avatar = styled('img', {
  width: 32,
  height: 32,
  objectFit: 'cover',
  borderRadius: '50%',
  border: '2px solid $grey400',
})

const Author = styled('div', {
  display: 'flex',
  alignItems: 'center',
  color: '$grey600',
  margin: '0 auto',

  '> :first-child': {
    marginRight: '$2',
  },
})
