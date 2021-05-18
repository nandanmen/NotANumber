import tw, { styled } from 'twin.macro'

import Widget from '@/elements/Widget'

const Figure = (props) => (
  <Widget className="full-width">
    <figure
      tw="z-0 max-w-full overflow-x-scroll md:overflow-x-hidden"
      {...props}
    />
  </Widget>
)

Figure.Content = styled.div`
  ${tw`relative z-20 px-8 py-16 md:rounded-xl`}

  background: var(--gray200);
  border: 2px solid var(--gray300);
`

Figure.Caption = tw.div`px-8 mt-4 text-sm text-center md:px-0`

export default Figure
