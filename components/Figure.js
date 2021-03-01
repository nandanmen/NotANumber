import tw from 'twin.macro'

const Figure = (props) => (
  <figure
    tw="z-0 max-w-full mt-4 mb-8 overflow-x-scroll md:overflow-x-hidden"
    className="full-width"
    {...props}
  />
)

Figure.Content = tw.div`relative z-20 px-8 py-16 bg-gray-200 md:rounded-2xl dark:bg-blacks-500`

Figure.Caption = tw.div`px-8 mt-4 text-sm text-center md:px-0`

export default Figure
