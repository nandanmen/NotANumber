import { styled } from 'twin.macro'

export default function ExternalLink(props) {
  return <Anchor target="_blank" rel="noreferrer" {...props} />
}

const Anchor = styled.a`
  color: var(--color-highlight);
  font-weight: 600;

  &:hover {
    --color-highlight: var(--color-text-secondary);
  }
`
