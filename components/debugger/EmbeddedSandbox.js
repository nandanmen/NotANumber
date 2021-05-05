import React from 'react'
import tw, { styled } from 'twin.macro'

import LiveEditor from '../shared/LiveEditor'
import { Tree, useSyntaxTree } from '../sandboxes/AstSandbox'
import Widget from '../Widget'

export default function EmbeddedSandbox({
  initialCode = '',
  depth = 0,
  showProps = false,
  hideDetailView = false,
  hideEditor = false,
  whitelist = new Set(),
  children,
  getParent,
  ...props
}) {
  const [code, setCode] = React.useState(initialCode)
  const [showAllProps, toggle] = React.useReducer((state) => !state, showProps)
  const tree = useSyntaxTree(code, { getParent })

  return (
    <Widget tw="space-y-6 overflow-hidden">
      {!hideEditor && (
        <div>
          <LiveEditor value={code} onValueChange={(code) => setCode(code)} />
        </div>
      )}
      <div tw="font-mono text-sm overflow-x-scroll relative">
        {!hideDetailView && (
          <label tw="absolute top-0 right-0 z-20 text-gray-500">
            Show all properties
            <input
              tw="ml-2"
              type="checkbox"
              checked={showAllProps}
              onChange={toggle}
            />
          </label>
        )}
        <Tree
          tree={tree}
          depth={depth}
          code={code}
          variant={showAllProps ? Tree.variants.Detail : Tree.variants.Node}
          whitelist={whitelist}
          {...props}
        />
      </div>
      {children && <Caption>{children}</Caption>}
    </Widget>
  )
}

const Caption = styled(Widget.Caption)`
  position: relative;
  padding-top: 8px;
  width: 100%;
  display: block;

  &:after {
    ${tw`bg-gray-400 dark:bg-gray-500`}

    content: '';
    position: absolute;
    height: 2px;
    width: 2rem;
    top: 0;
  }
`
