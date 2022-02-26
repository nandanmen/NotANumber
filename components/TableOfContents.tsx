import { styled } from '@/stitches'

type Anchor = {
  url: `#${string}`
  depth: number
  text: string
}

export function TableOfContents({ anchors }: { anchors: Anchor[] }) {
  return (
    <Wrapper>
      {anchors.map(({ url, depth, text }) => (
        <Item key={url} sub={depth > 2}>
          <Link href={url}>{text}</Link>
        </Item>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled('ul', {
  position: 'fixed',
  top: '$28',
  left: '$8',
  fontSize: '$sm',
  display: 'none',
  maxWidth: 300,

  '@xl': {
    display: 'revert',
  },
})

const Item = styled('li', {
  variants: {
    sub: {
      true: {
        paddingLeft: '$4',
      },
    },
  },
})

const Link = styled('a', {
  '&:hover': {
    color: '$highlight',
  },
})
