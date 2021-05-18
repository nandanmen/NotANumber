import { styled } from 'twin.macro'

const OrderedList = styled.ol`
  list-style-type: decimal;
  padding-left: 16px;

  > :not([hidden]) ~ :not([hidden]) {
    margin-top: 8px;
  }
`

export default OrderedList
