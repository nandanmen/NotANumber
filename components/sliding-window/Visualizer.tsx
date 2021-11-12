import { styled } from '@/stitches'

import { AlgorithmPlayer } from '../AlgorithmPlayer'

export default function Visualizer(props) {
  return (
    <Wrapper className="full-width">
      <AlgorithmPlayer {...props} />
    </Wrapper>
  )
}

const Wrapper = styled('figure', {
  marginTop: '$8 !important',
  marginBottom: '$16 !important',
})
