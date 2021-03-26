import React from 'react'
import { motion, AnimateSharedLayout } from 'framer-motion'
import 'twin.macro'

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
    <motion.button
      layout="position"
      tw="block text-gray-500"
      onClick={() => setIsOpen((open) => !open)}
    >
      {node.type} {isOpen ? '-' : '+'}
    </motion.button>
  ) : (
    <motion.p layout="position" tw="text-gray-500">
      {node.type}
    </motion.p>
  )

  return (
    <motion.li
      tw="space-y-2"
      layout="position"
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: -4, opacity: 0 }}
    >
      {label}
      <CodeBlock tw="p-2! inline-block">{source}</CodeBlock>
      {isOpen && hasChildren && (
        <ul tw="list-none! space-y-4 pl-8">
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
    </motion.li>
  )
}

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
