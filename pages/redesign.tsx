import { HiArrowRight } from 'react-icons/hi'

import { styled } from '@/stitches'
import { DebuggerIcon } from '@/components/debugger/DebuggerIcon'
import { SlidingWindowIcon } from '@/components/sliding-window/SlidingWindowIcon'
import { HowArraysWorkIcon } from '@/components/how-arrays-work/HowArraysWorkIcon'

import { frontMatter as slidingWindow } from './sliding-window.mdx'
import { frontMatter as debuggerPost } from './debugger.mdx'
import { frontMatter as howArraysWork } from './how-arrays-work.mdx'

let posts = [
  {
    post: slidingWindow,
    icon: <SlidingWindowIcon />,
  },
  {
    post: debuggerPost,
    icon: <DebuggerIcon />,
  },
  {
    post: howArraysWork,
    icon: <HowArraysWorkIcon />,
  },
]

posts = posts.sort((postA, postB) => {
  return (
    new Date(postB.post.editedAt).valueOf() -
    new Date(postA.post.editedAt).valueOf()
  )
})

export default function IndexPage() {
  return (
    <Main>
      <Header>
        <Title>Not a Number</Title>
        <Description>
          An interactive blog on computer science and web development, by{' '}
          <ExternalLink href="https://narendras.io" target="_blank">
            Nanda Syahrasyad.
          </ExternalLink>
        </Description>
      </Header>
      <Posts>
        {posts.map(({ post, icon }) => (
          <Post key={post.__resourcePath} post={post} icon={icon} />
        ))}
      </Posts>
    </Main>
  )
}

function Post({ post, icon }) {
  return (
    <PostWrapper>
      <PostIcon>{icon}</PostIcon>
      <PostContent>
        <PostHeader>
          <PostTitle>
            {post.title}{' '}
            <Arrow>
              <HiArrowRight />
            </Arrow>
          </PostTitle>
          <PostUpdatedDate>Last updated {post.editedAt}</PostUpdatedDate>
        </PostHeader>
        <p>{post.description}</p>
      </PostContent>
    </PostWrapper>
  )
}

const ExternalLink = styled('a', {
  color: '$blue10',
  fontWeight: 600,
})

const PostUpdatedDate = styled('p', {
  color: '$slate10',
})

const PostTitle = styled('h1', {
  fontFamily: 'Cal Sans',
  fontSize: '$2xl',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  marginTop: -12,
})

const Arrow = styled('span', {
  fontSize: '$xl',
})

const PostHeader = styled('header', {
  marginBottom: '$4',
})

const PostIcon = styled('div', {
  background: '$slate4',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  width: '$space$36',
  aspectRatio: 1,
  flexShrink: 0,
  variants: {
    color: {
      blue: {
        background: '$blue10',
      },
    },
  },
})

const PostContent = styled('article', {
  maxWidth: '65ch',
})

const PostWrapper = styled('li', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '$8',
})

const Main = styled('main', {
  fontFamily: '$sans',
  background: '$slate2',
  color: '$slate12',
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  padding: '$32 $16',
  alignItems: 'flex-start',
  lineHeight: 1.7,
})

const Posts = styled('ul', {
  paddingLeft: '$12',

  '> :not(:last-child)': {
    marginBottom: '$16',
  },
})

const Header = styled('header', {
  borderRight: '2px solid $slate4',
  paddingRight: '$12',
  paddingBottom: '$12',
})

const Title = styled('h1', {
  fontFamily: 'Cal Sans',
  fontSize: '5rem',
  lineHeight: 1,
  marginBottom: '$8',
})

const Description = styled('p', {
  fontFamily: '$sans',
})
