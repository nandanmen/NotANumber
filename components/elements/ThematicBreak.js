import tw, { styled } from 'twin.macro'

function ThematicBreak(props) {
  return (
    <Container {...props}>
      <Circle />
      <Circle />
      <Circle />
    </Container>
  )
}

export default styled(ThematicBreak)``

const Circle = styled.div`
  ${tw`bg-gray-500`}

  width: 12px;
  height: 12px;
  border-radius: 50%;
`

const Container = styled.div`
  ${tw`space-x-4`}

  width: 100%;
  display: flex;
  justify-content: center;
`
