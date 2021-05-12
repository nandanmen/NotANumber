import 'twin.macro'

import Widget from '@/elements/Widget'

import TranspilerSandbox from './shared/TranspilerSandbox'

export default function EmbeddedTranspiler({ children, ...props }) {
  return (
    <Widget className="full-width-2x">
      <TranspilerSandbox {...props} />
      <Widget.Caption tw="px-8 md:px-0">{children}</Widget.Caption>
    </Widget>
  )
}
