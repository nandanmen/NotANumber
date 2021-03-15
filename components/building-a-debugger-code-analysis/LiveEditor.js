import { HiPencil } from 'react-icons/hi'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import tw, { styled, theme } from 'twin.macro'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'

export default function LiveEditor({ className, ...delegated }) {
  return (
    <EditorWrapper className={className}>
      <Editor
        highlight={(code) => highlight(code, languages.js)}
        {...delegated}
      />
      <div tw="absolute top-2 right-2 text-xl text-gray-400">
        <HiPencil />
      </div>
    </EditorWrapper>
  )
}

const EditorWrapper = styled.div`
  ${tw`relative h-full p-6 border-4 rounded-md`}

  background: var(--code-background);
  border-color: var(--code-border-color);

  &:focus-within {
    border-color: ${theme`colors.blue.400`};
  }

  .keyword {
    color: var(--token-color-keyword);
    font-style: var(--token-style-keyword);
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
