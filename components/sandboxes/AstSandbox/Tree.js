import React from 'react'
import { motion, AnimateSharedLayout } from 'framer-motion'
import { styled, theme } from 'twin.macro'

import CodeBlock from '../../CodeBlock'

const TreeContext = React.createContext()

const useTreeContext = () => React.useContext(TreeContext)

/**
 * The Tree component is an interactive AST. Given a `tree` and a `depth`, this
 * component renders all tree nodes up to the given depth. Deeper nodes can be
 * toggled by clicking on the node labels.
 *
 * The given tree is assumed to be an AST produced by @babel/parse.
 */
export default function Tree({ className, tree, code, depth = 0 }) {
  return (
    <motion.ul
      layout="position"
      tw="list-none! space-y-4"
      className={className}
    >
      <TreeContext.Provider value={{ depth, code }}>
        <AnimateSharedLayout>
          <AstNode node={tree} path={[]} depth={0} />
        </AnimateSharedLayout>
      </TreeContext.Provider>
    </motion.ul>
  )
}

function AstNode({ node, path, depth }) {
  const { depth: initialDepth, code } = useTreeContext()
  const [isOpen, setIsOpen] = React.useState(depth <= initialDepth)

  const children = Object.entries(node).filter(([, value]) => isAstNode(value))
  const hasChildren = children.length > 0
  const source = code.slice(node.start, node.end)

  const label = hasChildren ? (
    <button tw="block" onClick={() => setIsOpen((open) => !open)}>
      {node.type} {isOpen ? '-' : '+'}
    </button>
  ) : (
    <p>{node.type}</p>
  )

  return (
    <Node>
      <NodeLabel
        tw="text-gray-500 bg-gray-100 dark:bg-blacks-700 relative z-10"
        showLine={path.length !== 0}
      >
        {label}
      </NodeLabel>
      <div tw="relative z-10 pt-2 mb-2 bg-gray-100 dark:bg-blacks-700">
        <CodeBlock tw="p-2! inline-block">{source}</CodeBlock>
      </div>
      {isOpen && hasChildren && (
        <ul tw="list-none! pl-8">
          {children.map(([key, value]) =>
            Array.isArray(value) ? (
              value.map((node, index) => (
                <AstNode
                  key={toKey([...path, key, index])}
                  node={node}
                  path={[...path, key, index]}
                  depth={depth + 1}
                />
              ))
            ) : (
              <AstNode
                key={toKey([...path, key])}
                node={value}
                path={[...path, key]}
                depth={depth + 1}
              />
            )
          )}
        </ul>
      )}
    </Node>
  )
}

// --

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

  --line-color: ${theme`colors.gray.400`};

  @media (prefers-color-scheme: dark) {
    --line-color: ${theme`colors.gray.700`};
  }

  > ul > li:last-child {
    &:before {
      content: '';
      position: absolute;
      height: 100%;
      background: ${theme`colors.gray.100`};
      width: 2px;
      left: -1rem;
      z-index: 10;

      @media (prefers-color-scheme: dark) {
        background: ${theme`colors.blacks.700`};
      }
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
  `}
`

// -- Helpers

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
