import 'twin.macro'

import TranspilerSandbox from './TranspilerSandbox'
import Widget from '../Widget'

export default function EmbeddedTranspiler({ children, ...props }) {
  return (
    <Widget className="full-width-2x">
      <TranspilerSandbox {...props} />
      <Widget.Caption tw="px-8 md:px-0">{children}</Widget.Caption>
    </Widget>
  )
}
