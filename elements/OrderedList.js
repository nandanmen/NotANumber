import React from 'react'
import { styled } from 'twin.macro'

export default function OrderedList({ children }) {
  return (
    <ListWrapper>
      {React.Children.map(children, (child, index) => (
        <ListItem key={index}>
          <div>{child.props.children}</div>
        </ListItem>
      ))}
    </ListWrapper>
  )
}

const ListWrapper = styled.ol`
  list-style: none;
  counter-reset: counts 0;

  > :not([hidden]) ~ :not([hidden]),
  ol {
    margin-top: 8px;
  }
`

const ListItem = styled.li`
  counter-increment: counts 1;
  display: flex;

  &:before {
    content: counter(counts) '. '; // {count}.
    padding-right: 16px;
    font-family: var(--text-mono);
    font-weight: 500;
    color: var(--gray600);
  }
`
