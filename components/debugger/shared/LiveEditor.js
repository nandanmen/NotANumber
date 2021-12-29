import { HiPencil } from 'react-icons/hi'
import tw, { styled } from 'twin.macro'

import { CodeEditor } from '@/components/CodeEditor'

export default function LiveEditor({ className = '', ...delegated }) {
  return (
    <EditorWrapper className={className}>
      <CodeEditor {...delegated} />
      <div tw="absolute top-2 right-2 text-xl text-gray-400">
        <HiPencil />
      </div>
    </EditorWrapper>
  )
}

const EditorWrapper = styled.div`
  ${tw`relative h-full p-6 text-sm border-2 rounded-md focus-within:shadow-md`}

  background: var(--code-background);
  border-color: var(--code-border-color);
  font-family: var(--text-mono);

  &:focus-within {
    border-color: var(--color-highlight-secondary);
  }
`
