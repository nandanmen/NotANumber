import { styled } from 'twin.macro'

const UnorderedList = styled.ul`
  list-style-type: disc;
  padding-left: 16px;

  > :not([hidden]) ~ :not([hidden]) {
    margin-top: 8px;
  }
`

export default UnorderedList
