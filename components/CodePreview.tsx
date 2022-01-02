import { styled } from '@/stitches'
import { Algorithm } from '@/components/AlgorithmPlayer'
import CodeBlock from '@/elements/CodeBlock'

export function CodePreview({
  algorithm,
  children,
  language = 'ts',
  ...props
}) {
  return (
    <>
      <CodeWrapper language={language}>{algorithm.code}</CodeWrapper>
      <Algorithm algorithm={algorithm} {...props}>
        {children}
      </Algorithm>
    </>
  )
}

const CodeWrapper = styled(CodeBlock, {
  position: 'relative',
  width: 'fit-content',
  maxWidth: 'calc(100vw - 32px)',
  transform: 'translateY(16px)',
  margin: '0 auto',
  zIndex: 10,
})
