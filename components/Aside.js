import tw, { styled } from 'twin.macro'

function Aside({ title, children, className }) {
  return (
    <aside className={className}>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </aside>
  )
}

/**
 * We have to wrap Aside in `styled` here so we can target it in a parent selector.
 */
export default styled(Aside)``

const Title = styled.h1`
  ${tw`font-mono bg-gray-800 shadow-md`};

  margin-left: 16px;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: bold;
  transform: translateY(8px);
  color: white;
`

const Content = styled.div`
  ${tw`bg-gray-300`}

  padding: 16px;
  border-radius: 8px;
`
