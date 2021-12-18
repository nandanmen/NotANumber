import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'
import { styled } from '@/stitches'

const links = [
  {
    title: 'How Does a Compiler Work?',
    href: './compiler/01-how-does-a-compiler-work',
    draft: false,
  },
  {
    title: 'The Terrific Tokenizer',
    href: './compiler/02-the-terrific-tokenizer',
    draft: false,
  },
  {
    title: 'The Intricacies of Parsing console.log',
    href: './compiler/03-the-intricacies-of-parsing-console-log',
    draft: true,
  },
  {
    title: 'Vexing Visitors and Generating Code',
    href: './compiler/04-vexing-visitors-and-generating-code',
    draft: true,
  },
  {
    title: 'Elegantly Handling Errors',
    href: './compiler/05-elegantly-handling-errors',
    draft: true,
  },
  {
    title: 'Introducing Variables',
    href: './compiler/06-introducing-variables',
    draft: true,
  },
]

export function PageList() {
  return (
    <List>
      {links.map(({ title, href, draft }) => (
        <ListLink key={href} title={title} href={href} draft={draft} />
      ))}
    </List>
  )
}

const List = styled('ol', {
  counterReset: 'list',

  '> :not(:last-child)': {
    marginBottom: '$4',
  },
})

function ListLink({ title, href, draft }) {
  return (
    <LetterWrapper draft={draft}>
      <Link href={href}>
        <LetterTitle>
          {title}{' '}
          <span>
            <HiArrowRight />
          </span>
        </LetterTitle>
      </Link>
      {draft && <DraftText>Coming soon</DraftText>}
    </LetterWrapper>
  )
}

const DraftText = styled('p', {
  color: '$grey600',
  fontFamily: '$mono',
})

const LetterWrapper = styled('li', {
  counterIncrement: 'list',
  position: 'relative',
  paddingLeft: '$12',

  '&:before': {
    content: `counter(list, lower-roman) "."`,
    position: 'absolute',
    left: 0,
    top: 0,
    aspectRatio: 1,
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '$serif',
    fontWeight: 600,
    borderRadius: 8,
    border: '2px solid $black',
  },

  variants: {
    draft: {
      true: {
        opacity: 0.5,
        pointerEvents: 'none',
      },
    },
  },

  '@md': {
    paddingLeft: '$16',
    paddingTop: 4,
  },
})

const LetterTitle = styled('a', {
  fontFamily: '$serif',
  fontWeight: 600,
  fontSize: '$xl',
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  marginRight: '$4',

  span: {
    marginLeft: 'auto',
  },

  '&:hover': {
    color: '$blue',
  },
})
