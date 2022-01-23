import { styled } from '@/stitches'
import { Algorithm } from '@/components/AlgorithmPlayer'
import CodeBlock from '@/elements/CodeBlock'

export function CodePreview({
  algorithm,
  children,
  language = 'ts',
  highlight = '',
  ...props
}) {
  return (
    <>
      <CodeWrapper language={language} highlight={highlight}>
        {algorithm.code}
      </CodeWrapper>
      <Algorithm algorithm={algorithm} {...props}>
        {children}
      </Algorithm>
    </>
  )
}

const CodeWrapper = styled(CodeBlock, {
  position: 'relative',
  maxWidth: 'fit-content',
  transform: 'translateY(16px)',
  margin: '0 auto',
  zIndex: 10,
})