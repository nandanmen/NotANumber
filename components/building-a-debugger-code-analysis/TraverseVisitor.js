import React from 'react'
import tw, { styled, theme } from 'twin.macro'
import { BsPlayFill, BsPauseFill } from 'react-icons/bs'

import { Tree, useSyntaxTree } from '../sandboxes/AstSandbox'
import exec from '../../lib/exec'
import usePlayer from '../../lib/usePlayer'
import snapshot from '../../lib/snapshot.macro'
import Button from '../elements/Button'

const code = `let a = 10`

const visitors = ['Identifier', 'VariableDeclaration']

const algorithm = snapshot(function traverse(tree) {
  // eslint-disable-next-line no-debugger
  debugger
  const children = Object.values(tree)
    .filter(isAstNode)
    .flatMap((node) => (Array.isArray(node) ? node : [node]))
  children.forEach(traverse)
})

export default function TraverseVisitor() {
  const tree = useSyntaxTree(code)
  const steps = React.useMemo(() => exec(algorithm.entryPoint, [tree]), [tree])
  const { models, actions } = usePlayer(steps)

  const activeNodeType = models.state.tree.type
  return (
    <div>
      <Controls>
        <Button tw="bg-white" onClick={actions.toggle}>
          {models.isPlaying ? <BsPauseFill /> : <BsPlayFill />}
        </Button>
        <Slider
          type="range"
          min="0"
          max={steps.length - 1}
          value={models.activeStepIndex}
          onInput={(evt) => actions.setIndex(evt.target.valueAsNumber)}
        />
      </Controls>
      <ContentWrapper>
        <Tree
          tree={tree}
          code={code}
          depth={Number.POSITIVE_INFINITY}
          activeNodeType={activeNodeType}
        />
        <Visitor>
          <VisitorTitle>Visitor</VisitorTitle>
          {visitors.map((nodeType) => (
            <Handler key={nodeType} active={nodeType === activeNodeType}>
              {nodeType}
            </Handler>
          ))}
        </Visitor>
      </ContentWrapper>
    </div>
  )
}

function isAstNode(value) {
  if (Array.isArray(value)) {
    const [first] = value
    if (first) {
      return typeof first === 'object' && first.hasOwnProperty('type')
    }
  }

  if (value && typeof value === 'object') {
    return value.hasOwnProperty('type')
  }

  return false
}

const Controls = styled.div`
  padding: 0 32px;
  margin-bottom: 24px;
  display: flex;
  column-gap: 16px;
`

const Slider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    background: white;
    border: 2px solid var(--code-border-color);
    border-radius: 50%;
    ${tw`shadow-sm`};
    margin-top: -10px;
  }

  &::-moz-range-thumb {
    height: 24px;
    width: 24px;
    background: white;
    border: 2px solid var(--code-border-color);
    border-radius: 50%;
    ${tw`shadow-sm`};
  }

  &::-webkit-slider-runnable-track {
    height: 4px;
    ${tw`bg-gray-300`};
  }

  &::-moz-range-track {
    height: 4px;
    ${tw`bg-gray-300`};
  }
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-column-gap: 16px;
  align-items: flex-start;
`

const Visitor = styled.ul`
  ${tw`font-mono bg-gray-200`}

  border-radius: 8px;
  padding: 16px;
  list-style: none !important;

  > li {
    margin-top: 4px;
  }
`

const VisitorTitle = styled.h1`
  margin-bottom: 16px;
`

const Handler = styled.li`
  --color-background: ${({ active }) =>
    active ? `var(--token-color-keyword)` : theme`colors.gray.300`};
  --color-text: ${({ active }) => (active ? 'white' : 'revert')};

  background: var(--color-background);
  color: var(--color-text);
  border-radius: 4px;
  padding: 6px;
`
