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
                style={{ opacity: lineNumbers.includes(i) ? 1 : 0.3 }}
              >
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
              </Line>
            ))}
          </StyledBlock>
        )
      }}
    </Highlight>
  )
}

export default styled(CodeBlock)``

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
  const numbers = getHighlightedIntervals(highlight)
  return {
    /**
     * @param {number} lineNumber
     * @returns {boolean} whether the given line number should be highlighted
     */
    includes(lineNumber) {
      if (!highlight) {
        return true
      }
      return numbers.find((intervalOrNumber) => {
        if (Array.isArray(intervalOrNumber)) {
          const [start, end] = intervalOrNumber
          return lineNumber >= start && lineNumber <= end
        }
        return lineNumber === intervalOrNumber
      })
    },
  }
}

/**
 * Given a highlight string like 3-5,6,10-12, returns the intervals
 * for lines to be highlighted.
 *
 * e.g given "3-5,6,10-12", returns the array [[3, 5], 6, [10, 12]]
 */
function getHighlightedIntervals(highlight) {
  if (!highlight) return []

  const groups = highlight.split(',')
  return groups.map((group) => {
    const interval = group.split('-')
    if (interval.length < 2) {
      return Number(interval[0])
    }
    return interval.map(Number)
  })
}

const StyledBlock = styled.pre`
  background: var(--code-background);
  border: 2px solid var(--code-border-color, black);
  color: var(--code-text-color);
  padding: var(--space, 24px);
`

const Line = styled.div`
  background: hsla(0, 0%, 100%, var(--bg-opacity, 0));
`
