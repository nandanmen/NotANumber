import tw, { styled } from 'twin.macro'

export default function ExternalLink(props) {
  return <Anchor target="_blank" rel="noreferrer" {...props} />
}

const Anchor = styled.a`
  ${tw`hover:text-gray-700 dark:hover:text-gray-400`}
  font-weight: 600;
  color: var(--color-highlight);
`
