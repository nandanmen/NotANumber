import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { styled } from '@/stitches'

export const links = [
  {
    title: 'How Does a Compiler Work?',
    href: '/compiler/01-how-does-a-compiler-work',
    draft: false,
  },
  {
    title: 'The Terrific Tokenizer',
    href: '/compiler/02-the-terrific-tokenizer',
    draft: false,
  },
  {
    title: 'The Intricacies of Parsing console.log',
    href: '/compiler/03-the-intricacies-of-parsing-console-log',
    draft: true,
  },
  {
    title: 'Vexing Visitors',
    href: '/compiler/04-vexing-visitors-and-generating-code',
    draft: true,
  },
]

export function PageList() {
  const router = useRouter()
  return (
    <List>
      {links.map(({ href, ...post }) => (
        <ListLink
          key={href}
          active={href === router.pathname}
          href={href}
          {...post}
        />
      ))}
    </List>
  )
}

const List = styled('ol', {
  display: 'none',

  '@md': {
    counterReset: 'list',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '$2',
  },
})

function ListLink({ title, href, draft, active = false }) {
  return (
    <Link href={href}>
      <LetterWrapper>
        <LetterLinkWrapper
          active={active}
          draft={draft}
          whileHover="hover"
          variants={{ hover: { x: -4, y: -4 } }}
        >
          <LinkTitle>{title}</LinkTitle>
          {draft && <ComingSoonText>Coming soon</ComingSoonText>}
        </LetterLinkWrapper>
      </LetterWrapper>
    </Link>
  )
}

const LetterWrapper = styled('li', {
  counterIncrement: 'list',
  position: 'relative',
  minHeight: '$48',

  '&:before': {
    content: '',
    position: 'absolute',
    inset: 0,
    background: '$black',
    borderRadius: 4,
  },
})

const LetterLinkWrapper = styled(motion.a, {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '$8',
  position: 'relative',
  padding: '$4',
  background: '$white',
  border: '2px solid $black',
  cursor: 'pointer',
  borderRadius: 4,
  height: '100%',

  '&:after': {
    content: `counter(list, lower-roman) "."`,
    position: 'absolute',
    top: '$2',
    right: '$2',
    height: '2rem',
    fontFamily: '$serif',
    fontWeight: 600,
  },

  variants: {
    draft: {
      true: {
        background: '$grey200',
        border: '2px dashed $grey300',
        pointerEvents: 'none',
        color: '$grey400',
      },
    },
    active: {
      true: {
        background: '$teal',
      },
    },
  },
})

const LinkTitle = styled('p', {
  fontFamily: '$serif',
  fontWeight: 600,
  lineHeight: 1,
  fontSize: '$xl',
})

const ComingSoonText = styled('p', {
  fontSize: '$sm',
  fontFamily: '$mono',
  position: 'absolute',
  top: '$2',
  left: '$2',
})
