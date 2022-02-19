import { styled } from '@/stitches'

import { Algorithm } from './Algorithm'

export * from './AnimationWrapper'
export * from './Algorithm'

export function AlgorithmPlayer({ algorithm, caption, children, ...props }) {
  return (
    <Wrapper>
      <Algorithm algorithm={algorithm} {...props}>
        {children}
      </Algorithm>
      {caption && <Caption>{caption}</Caption>}
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  zIndex: 0,
  maxWidth: '100%',
  overflowX: 'scroll',

  '@md': {
    overflowX: 'hidden',
  },
})

const Caption = styled('p', {
  padding: '$0 $8',
  marginTop: '$4',
  fontSize: '$sm',
  textAlign: 'center',
})
