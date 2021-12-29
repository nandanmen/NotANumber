import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'

import { styled } from '@/stitches'

type CodeEditorProps = {
  value: string
  onValueChange: (newValue: string) => void
  language?: string
}

export function CodeEditor({ language = 'js', ...props }: CodeEditorProps) {
  return (
    <StyledEditor
      highlight={(code) => highlight(code, languages[language])}
      {...props}
    />
  )
}

const StyledEditor = styled(Editor, {
  width: '100%',
  height: '100%',
  fontFamily: '$mono',

  textarea: {
    outline: 'none',
  },

  '.keyword': {
    color: `var(--token-color-keyword)`,
    fontStyle: `var(--token-style-keyword)`,
  },

  '.comment': {
    color: `var(--token-color-comment)`,
    fontStyle: `var(--token-style-comment)`,
  },

  '.string': {
    color: `var(--token-color-string)`,
    fontStyle: `var(--token-style-string)`,
  },

  '.function': {
    color: `var(--token-color-function)`,
    fontStyle: `var(--token-style-function)`,
  },

  '.number': {
    color: `var(--token-color-number)`,
    fontStyle: `var(--token-style-number)`,
  },
})
