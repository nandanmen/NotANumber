import AstSandbox from './AstSandbox'
import 'twin.macro'

export default function EmbeddedSandbox(props) {
  return (
    <div
      tw="font-mono space-y-4 text-sm md:(flex space-x-4 space-y-0)"
      className="full-width-2x"
    >
      <AstSandbox {...props} />
    </div>
  )
}
