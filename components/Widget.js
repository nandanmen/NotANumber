import tw, { styled } from 'twin.macro'

const Widget = styled.figure`
  ${tw`mt-6! mb-12!`}
`

Widget.Caption = tw.figcaption`text-center w-full font-sans mt-4 text-gray-500 text-sm`

export default Widget
