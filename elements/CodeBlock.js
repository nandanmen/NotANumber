import Highlight, { defaultProps } from 'prism-react-renderer'
import { styled } from 'twin.macro'

function CodeBlock({
  children = '',
  highlight = '',
  style = {},
  className: containerClass,
}) {
  const lineNumbers = getLineNumbers(highlight)
  return (
    <Highlight {...defaultProps} code={getCode(children).trim()} language="jsx">
      {({ className, tokens, getTokenProps }) => {
        return (
          <StyledBlock
            className={`${className} ${containerClass}`}
            tw="rounded-md overflow-x-auto text-sm"
            style={style}
          >
            {tokens.map((line, i) => (
              <Line
                key={i}
                style={{ '--bg-opacity': lineNumbers.includes(i) ? 0.1 : 0 }}
              >
                {line.map((token, key) => {
                  const { children, className } = getTokenProps({
                    token,
                    key,
                  })
                  const [, tokenType] = className.split(' ')
                  if (isAnnotation(tokenType, children)) {
                    return <Annotation key={key}>{children}</Annotation>
                  }
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
              </Line>
            ))}
          </StyledBlock>
        )
      }}
    </Highlight>
  )
}

export default styled(CodeBlock)``

function Annotation({ children }) {
  let label = children.replace('/* ', '')
  label = label.replace(' */', '')
  return <AnnotationWrapper>{label}</AnnotationWrapper>
}

function isAnnotation(tokenType, text) {
  return tokenType === 'comment' && text.startsWith('/*') && text.endsWith('*/')
}

const AnnotationWrapper = styled.span`
  background: var(--gray100);
  font-size: var(--text-sm);
  padding: 2px;
  border-radius: 2px;
`

// --

function getCode(children) {
  if (typeof children === 'string') {
    return children
  }

  if (children.props?.mdxType === 'code') {
    return children.props.children
  }

  return ''
}

function getLineNumbers(highlight) {
  const numbers = highlight.split(',').map(Number)
  return {
    /**
     * @param {number} lineNumber
     * @returns {boolean} whether the given line number should be highlighted
     */
    includes(lineNumber) {
      if (!highlight.length) {
        return false
      }
      return numbers.includes(lineNumber)
    },
  }
}

const StyledBlock = styled.pre`
  background: var(--code-background);
  border: 2px solid var(--code-border-color, black);
  color: var(--code-text-color);
  padding: var(--space, 24px);
  font-family: var(--text-mono);
`

const Line = styled.div`
  background: hsla(0, 0%, 100%, var(--bg-opacity, 0));
`
