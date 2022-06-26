import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { styled } from '@/stitches'
import { CSSProperties } from 'react'

interface NavigationProps {
  style?: CSSProperties
  className?: string
}

export default function Navigation({ style, className }: NavigationProps) {
  return (
    <nav style={style} className={className}>
      <Wrapper>
        <HomeLinkWrapper>
          <Link href="/">
            <NavLink>NaN</NavLink>
          </Link>
        </HomeLinkWrapper>
        <GithubLinkWrapper>
          <NavLink
            href="https://github.com/narendrasss/blog"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />
          </NavLink>
        </GithubLinkWrapper>
        <li>
          <NavLink
            href="https://twitter.com/nandafyi"
            target="_blank"
            rel="noreferrer"
          >
            <FaTwitter />
          </NavLink>
        </li>
      </Wrapper>
    </nav>
  )
}

const Wrapper = styled('ul', {
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  fontSize: '$xl',
})

const HomeLinkWrapper = styled('li', {
  fontFamily: '$serif',
})

const GithubLinkWrapper = styled('li', {
  marginLeft: 'auto',
  marginRight: '$4',
})

const NavLink = styled('a', {
  cursor: 'pointer',
  '&:hover': {
    color: '$grey400',
  },
})
