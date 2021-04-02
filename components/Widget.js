import tw, { styled } from 'twin.macro'

const Widget = styled.figure`
  ${tw`mt-6! mb-12!`}
  max-width: 100vw;
`

Widget.Caption = tw.caption`w-full text-left mt-4 text-gray-500 text-sm`

export default Widget
