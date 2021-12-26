import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { styled } from '@/stitches'
import { blue, yellow, green } from '@radix-ui/colors'
import React from 'react'

const links = [
  {
    title: 'How Does a Compiler Work?',
    href: './compiler/01-how-does-a-compiler-work',
    draft: false,
    description: `In the first installment, we'll go over how a compiler works by looking at each step of the compiler pipeline.`,
  },
  {
    title: 'The Terrific Tokenizer',
    href: './compiler/02-the-terrific-tokenizer',
    draft: false,
    description: `The tokenizer is the module responsible for breaking up the source code into little chunks called tokens. In this section, we'll look at how it works by implementing it ourselves.`,
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
]

export function PageList() {
  return (
    <List>
      {links.map(({ href, ...post }, index) => (
        <ListLink key={href} href={href} index={index} {...post} />
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

const colors = [blue.blue6, yellow.yellow6, green.green6]

function ListLink({ title, href, draft, description = '', index = 0 }) {
  return (
    <Link href={href}>
      <LetterWrapper>
        <LetterLinkWrapper
          draft={draft}
          style={{ '--bg-color': colors[index] } as React.CSSProperties}
          whileHover="hover"
          variants={{ hover: { x: -4, y: -4 } }}
        >
          <LinkContent>
            <LinkTitle>{title}</LinkTitle>
            <Description draft={draft}>
              {draft ? 'Coming soon' : description}
            </Description>
          </LinkContent>
          <LinkArrow variants={{ hover: { x: 16 } }}>
            <HiArrowRight />
          </LinkArrow>
        </LetterLinkWrapper>
      </LetterWrapper>
    </Link>
  )
}

const LinkContent = styled('div', {
  '> :not(:last-child)': {
    marginBottom: '$2',
  },
})

const LetterWrapper = styled('li', {
  counterIncrement: 'list',
  position: 'relative',

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
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$8',
  position: 'relative',
  padding: '$8',
  background: 'var(--bg-color)',
  border: '2px solid $black',
  cursor: 'pointer',
  borderRadius: 4,

  '&:after': {
    content: `counter(list, lower-roman) "."`,
    position: 'absolute',
    left: '-1rem',
    top: 8,
    aspectRatio: 1,
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '$serif',
    fontWeight: 600,
    fontSize: '$sm',
    border: '2px solid $black',
    borderRadius: 4,
    background: 'white',
  },

  variants: {
    draft: {
      true: {
        background: '$grey200',
        border: '2px dashed $grey300',
        pointerEvents: 'none',
        color: '$grey400',

        '&:after': {
          border: '2px solid $grey300',
          background: '$grey200',
        },
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

const Description = styled('p', {
  fontSize: '$sm',

  '@md': {
    fontSize: '$base',
  },

  variants: {
    draft: {
      true: {
        color: '$grey600',
      },
    },
  },
})

const LinkArrow = styled(motion.div, {
  fontSize: '$xl',
})
