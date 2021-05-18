import React from 'react'
import { motion, AnimateSharedLayout } from 'framer-motion'
import tw, { styled, theme } from 'twin.macro'

import CodeBlock from '@/elements/CodeBlock'

const TreeContext = React.createContext()

const useTreeContext = () => React.useContext(TreeContext)

/**
 * The Tree component is an interactive AST. Given a `tree` and a `depth`, this
 * component renders all tree nodes up to the given depth. Deeper nodes can be
 * toggled by clicking on the node labels.
 *
 * The given tree is assumed to be an AST produced by @babel/parse.
 */
function Tree({
  className,
  tree,
  code,
  activeNodeType = null,
  variant = Tree.variants.Node,
  depth = 0,
  whitelist = new Set(),
}) {
  return (
    <motion.ul
      layout="position"
      tw="list-none! space-y-4 max-w-full font-mono text-sm"
      className={className}
    >
      <TreeContext.Provider
        value={{ depth, code, variant, whitelist, activeNodeType }}
      >
        <AnimateSharedLayout>
          <AstNode node={tree} path={[]} depth={0} />
        </AnimateSharedLayout>
      </TreeContext.Provider>
    </motion.ul>
  )
}

Tree.variants = {
  Detail: 'detail',
  Node: 'node',
}

export default Tree

function AstNode({ node, path, depth }) {
  const {
    depth: initialDepth,
    code,
    variant,
    whitelist,
    activeNodeType,
  } = useTreeContext()
  const [isOpen, setIsOpen] = React.useState(depth <= initialDepth)

  if (isAstNode(node)) {
    const children = Object.entries(node).filter(([key, value]) => {
      if (variant === Tree.variants.Detail) {
        return true
      }
      return isAstNode(value) || whitelist.has(key)
    })
    const hasChildren = children.length > 0
    const isActive = node.type === activeNodeType
    const source = code.slice(node.start, node.end)

    const label = hasChildren ? (
      <NodeToggle onClick={() => setIsOpen((open) => !open)}>
        {node.type} {isOpen ? '-' : '+'}
      </NodeToggle>
    ) : (
      <p>{node.type}</p>
    )

    return (
      <Node>
        <NodeLabel tw="relative z-10" showLine={path.length !== 0}>
          {label}
        </NodeLabel>
        <CodeWrapper>
          <CodeBlock
            tw="inline-block"
            style={{
              '--code-border-color': isActive
                ? `var(--color-highlight-secondary)`
                : undefined,
              '--space': '14px',
            }}
          >
            {source}
          </CodeBlock>
        </CodeWrapper>
        {isOpen && hasChildren && (
          <ul tw="list-none! pl-8">
            {children.map(([key, value]) => (
              <AstNodeGroup
                key={toKey([...path, key])}
                name={key}
                nodes={
                  Array.isArray(value)
                    ? value
                    : value && typeof value === 'object'
                    ? [value]
                    : value
                }
                path={[...path, key]}
                depth={depth + 1}
              />
            ))}
          </ul>
        )}
      </Node>
    )
  }

  if (typeof node === 'object') {
    return Object.entries(node).map(([key, value]) => {
      return (
        <AstNodeGroup
          key={toKey([...path, key])}
          name={key}
          nodes={
            Array.isArray(value)
              ? value
              : value && typeof value === 'object'
              ? [value]
              : value
          }
          path={[...path, key]}
          depth={depth + 1}
        />
      )
    })
  }
}

function AstNodeGroup({ name, nodes, path, depth }) {
  const { depth: initialDepth } = useTreeContext()
  const [isOpen, setIsOpen] = React.useState(depth <= initialDepth)

  const hasChildren = Array.isArray(nodes) && nodes.length > 0
  return (
    <Node>
      <NodeLabel tw="pb-2 mb-2 relative z-10" showLine>
        <NodePropToggle
          tw="space-x-1"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span tw="rounded-sm p-1">{name}</span>
          {hasChildren ? (
            <span>{isOpen ? '-' : '+'}</span>
          ) : (
            <span>
              {nodes === undefined ? 'undefined' : JSON.stringify(nodes)}
            </span>
          )}
        </NodePropToggle>
      </NodeLabel>
      {isOpen && hasChildren && (
        <ul tw="list-none! pl-8">
          {nodes.map((node, index) => (
            <AstNode
              key={toKey([...path, index])}
              node={node}
              path={[...path, index]}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </Node>
  )
}

// -- Styled --

const CodeWrapper = styled.div`
  ${tw`relative z-10 pt-1 mb-2`}
  background: var(--color-background);
`

const NodeToggle = styled.button`
  display: block;
  position: relative;

  &:focus {
    outline: none;
    color: var(--color-highlight-secondary);
  }
`

const NodePropToggle = styled.button`
  --bg-color: ${theme`colors.gray.200`};

  > :first-child {
    background-color: var(--bg-color);
    color: var(--color-text, revert);
  }

  &:focus {
    --bg-color: var(--color-highlight-secondary);
    --color-text: white;
    outline: none;
  }
`

const Node = styled(motion.li).attrs({
  layout: 'position',
  animate: {
    y: 0,
    opacity: 1,
  },
  initial: {
    y: -4,
    opacity: 0,
  },
})`
  position: relative;

  --line-color: black;

  > ul > li:last-child {
    &:before {
      content: '';
      position: absolute;
      height: 100%;
      background: var(--color-background);
      width: 4px;
      left: calc(-1rem - 1px);
      z-index: 10;
    }
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    width: 2px;
    background: var(--line-color);
    left: 1rem;
    z-index: -1;
  }
`

const NodeLabel = styled(motion.div).attrs({
  layout: 'position',
})`
  position: relative;
  background: var(--color-background);

  ${({ showLine }) =>
    showLine &&
    `
    &:after {
      content: '';
      position: absolute;
      height: 0.75rem;
      width: 0.75rem;
      top: -2px;
      left: -1rem;
      border-bottom: 2px solid var(--line-color);
      border-left: 2px solid var(--line-color);
      border-bottom-left-radius: 0.5rem;
    }
  `};
`

// -- Helpers --

function toKey(path) {
  return path.join('.')
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
