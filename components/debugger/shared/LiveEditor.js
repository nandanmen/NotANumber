import { HiPencil } from 'react-icons/hi'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import tw, { styled } from 'twin.macro'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'

export default function LiveEditor({ className, ...delegated }) {
  return (
    <EditorWrapper className={className}>
      <StyledEditor
        highlight={(code) => highlight(code, languages.js)}
        {...delegated}
      />
      <div tw="absolute top-2 right-2 text-xl text-gray-400">
        <HiPencil />
      </div>
    </EditorWrapper>
  )
}

const StyledEditor = styled(Editor)`
  width: 100%;
  height: 100%;

  textarea {
    outline: none;
  }
`

const EditorWrapper = styled.div`
  ${tw`relative h-full p-6 font-mono text-sm border-2 rounded-md focus-within:shadow-md`}

  background: var(--code-background);
  border-color: var(--code-border-color);

  &:focus-within {
    border-color: var(--color-highlight-secondary);
  }

  .keyword {
    color: var(--token-color-keyword);
    font-style: var(--token-style-keyword);
  }

  .comment {
    color: var(--token-color-comment);
    font-style: var(--token-style-comment);
  }

  .string {
    color: var(--token-color-string);
  }

  .function {
    color: var(--token-color-function);
  }

  .number {
    color: var(--token-color-number);
  }
`
