import tw, { styled } from 'twin.macro'

function ProblemStatement({ children, className }) {
  return (
    <aside className={className}>
      <Title>The Problem</Title>
      <Content>{children}</Content>
    </aside>
  )
}

/**
 * We have to wrap Aside in `styled` here so we can target it in a parent selector.
 */
export default styled(ProblemStatement)``

const Title = styled.h1`
  font-family: var(--text-mono);
  margin-left: 16px;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: var(--text-sm);
  transform: translateY(8px);
  background: var(--brown);
  border: 2px solid var(--border-color);
`

const Content = styled.div`
  padding: 16px;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  background: var(--teal);
`
