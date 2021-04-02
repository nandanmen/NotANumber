import React from 'react'
import { styled, theme } from 'twin.macro'

import TranspilerSandbox from './TranspilerSandbox'
import LiveEditor from '../shared/LiveEditor'
import Widget from '../Widget'
import useBabelPlugin from './useBabelPlugin'

/**
 * The VisitorSandbox component allows users to create their own Babel visitors and
 * run them through some code.
 *
 * To do this, the user's visitor code gets passed through our own Babel plugin and
 * evaluated using the function constructor. The evaluated code is a valid Babel
 * plugin which then gets passed to the TranspilerSandbox.
 */
export default function VisitorSandbox({ children, visitor, initialCode }) {
  const [pluginCode, setPluginCode] = React.useState(visitor)
  const plugin = useBabelPlugin(pluginCode, exportDefaultToReturn)

  return (
    <SandboxWrapper className="full-width-2x">
      <div tw="mb-4 md:mb-0">
        <LiveEditor value={pluginCode} onValueChange={setPluginCode} />
      </div>
      <aside tw="flex flex-col">
        <TranspilerSandbox
          mode="vertical"
          initialCode={initialCode}
          plugin={execute(plugin)}
        />
      </aside>
      {children && <Widget.Caption>{children}</Widget.Caption>}
    </SandboxWrapper>
  )
}

function execute(code) {
  return new Function(code)()
}

function exportDefaultToReturn({ types: t }) {
  return {
    visitor: {
      ExportDefaultDeclaration(path) {
        path.replaceWith(t.returnStatement(path.node.declaration))
      },
    },
  }
}

const SandboxWrapper = styled(Widget)`
  @media screen and (min-width: ${theme`screens.md`}) {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 1rem;
  }
`
