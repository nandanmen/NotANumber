import Highlight, { defaultProps } from 'prism-react-renderer'
import 'twin.macro'

export default function CodeBlock({ children, className }) {
  const language = className.replace(/language-/, '')

  return (
    <Highlight {...defaultProps} code={children} language={language}>
      {({ className, tokens, getTokenProps }) => (
        <pre
          className={`${className} full-width`}
          tw="rounded-md overflow-x-scroll text-sm p-4 bg-white border-2 border-gray-200"
        >
          {tokens.slice(0, tokens.length - 1).map((line, i) => (
            <div key={i}>
              {line.map((token, key) => {
                const { children, className } = getTokenProps({ token, key })
                const [, tokenType] = className.split('token ')
                return (
                  <span
                    key={key}
                    style={{
                      color: `var(--token-color-${tokenType})`,
                      fontStyle: `var(--token-style-${tokenType})`,
                    }}
                  >
                    {children}
                  </span>
                )
              })}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
