import TranspilerSandbox from './TranspilerSandbox'
import 'twin.macro'

export default function EmbeddedTranspiler(props) {
  return (
    <figure tw="font-mono md:flex" className="full-width-2x">
      <TranspilerSandbox {...props} />
    </figure>
  )
}
