import Highlight, { defaultProps } from 'prism-react-renderer'
import { styled } from 'twin.macro'

export default function CodeBlock({
  children = '',
  className: containerClass,
}) {
  return (
    <Highlight {...defaultProps} code={children.trim()} language="jsx">
      {({ className, tokens, getTokenProps }) => {
        return (
          <StyledBlock
            className={`${className} ${containerClass} full-width`}
            tw="rounded-md overflow-x-scroll text-sm p-6 border-4"
          >
            {tokens.map((line, i) => (
              <div key={i} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                {line.map((token, key) => {
                  const { children, className } = getTokenProps({
                    token,
                    key,
                  })
                  const [, tokenType] = className.split(' ')
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
          </StyledBlock>
        )
      }}
    </Highlight>
  )
}

const StyledBlock = styled.pre`
  background: var(--code-background);
  border-color: var(--code-background);
`
