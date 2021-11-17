import React from 'react'
import tw, { styled, theme } from 'twin.macro'
import { BsPlayFill, BsPauseFill } from 'react-icons/bs'

import Button from '@/elements/Button'

import exec from '@/lib/exec'
import usePlayer from '@/lib/usePlayer'

// Macros can't use absolute imports because they get stripped out
import snapshot from '../../lib/snapshot.macro'

import Tree from './shared/Tree'
import useSyntaxTree from './shared/useSyntaxTree'
import { Slider } from '../Slider'

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
  const [tree] = useSyntaxTree(code)
  const steps = React.useMemo(() => exec(algorithm.entryPoint, [tree]), [tree])
  const { models, actions } = usePlayer(steps)

  const activeNodeType = models.state.tree.type
  return (
    <div>
      <Controls>
        <Button onClick={actions.toggle}>
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

  > :first-child {
    margin-right: 16px;
  }
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-column-gap: 16px;
  align-items: flex-start;
  overflow-x: auto;
  padding: 0 32px;
  font-family: var(--text-mono);

  @media screen and (min-width: ${theme`screens.md`}) {
    padding: 0 2px;
  }
`

const Visitor = styled.ul`
  font-family: var(--text-mono);
  border-radius: 8px;
  padding: 16px;
  border: 2px solid var(--border-color);

  > li {
    margin-top: 4px;
  }
`

const VisitorTitle = styled.h1`
  margin-bottom: 16px;
`

const Handler = styled.li`
  --color-background: ${({ active }) =>
    active ? `var(--color-highlight-secondary)` : 'revert'};
  --color-text: ${({ active }) => (active ? 'white' : 'revert')};

  background: var(--color-background);
  color: var(--color-text);
  border-radius: 4px;
  padding: 6px;
`
