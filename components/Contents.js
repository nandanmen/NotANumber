import tw, { styled } from 'twin.macro'

export default function Contents({ headings }) {
  return (
    <List>
      {headings.map((heading) => (
        <li key={heading.text} tw="space-y-1">
          <p>{heading.text}</p>
          <ul tw="pl-4 space-y-1">
            {heading.subHeadings.map((subHeading) => (
              <li key={subHeading.text}>{subHeading.text}</li>
            ))}
          </ul>
        </li>
      ))}
    </List>
  )
}

const List = styled.ul`
  ${tw`space-y-1 text-sm text-gray-600`};

  position: fixed;
  left: 2rem;
  top: 30%;
`
