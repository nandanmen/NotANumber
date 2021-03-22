import React from 'react'
import { motion, AnimateSharedLayout } from 'framer-motion'
import { styled } from 'twin.macro'

const TreeContext = React.createContext()

const useTreeContext = () => React.useContext(TreeContext)

/**
 * The Tree component is an interactive AST. Given a `tree` and a `depth`, this
 * component renders all tree nodes up to the given depth. Deeper nodes can be
 * toggled by clicking on the node labels.
 *
 * The given tree is assumed to be an AST produced by @babel/parse.
 */
export default function Tree({ className, tree, depth = 2 }) {
  const visibleKeys = Object.entries(tree).filter(isVisible)
  return (
    <motion.ul layout="position" tw="list-none!" className={className}>
      <TreeContext.Provider value={{ depth }}>
        <AnimateSharedLayout>
          {visibleKeys.map(([key, value]) => (
            <Entry key={key} item={[key, value]} path={[key]} depth={0} />
          ))}
        </AnimateSharedLayout>
      </TreeContext.Provider>
    </motion.ul>
  )
}

/**
 * An Entry represents a single key-value pair in an AST node, uniquely identified
 * by its path from the root node.
 *
 * If the given value is an object or array, this component renders recursively.
 * Otherwise, the component renders a simple key -> value pair.
 */
function Entry({ item: [key, value], path = [], depth }) {
  const { depth: initialDepth } = useTreeContext()
  const [isOpen, setIsOpen] = React.useState(depth <= initialDepth)
  const newPath = [...path, key]

  /**
   * For arrays, the key of each item is its index. This doesn't look quite nice, so
   * we change the key to its AST node type.
   */
  if (Array.isArray(value)) {
    return (
      <ListItem>
        <ItemKey onClick={() => setIsOpen((open) => !open)}>
          <motion.span layout="position">{key}</motion.span>
          <ExpandIcon>{isOpen ? '-' : '+'}</ExpandIcon>
        </ItemKey>
        {isOpen && (
          <List>
            {value.map((node, index) => {
              const currentPath = [...newPath, index]
              return (
                <Entry
                  key={currentPath.join('.')}
                  item={[node.type, node]}
                  path={currentPath}
                  depth={depth + 1}
                />
              )
            })}
          </List>
        )}
      </ListItem>
    )
  }

  if (value != null && typeof value === 'object') {
    const validEntries = Object.entries(value).filter(isVisible)
    return (
      <ListItem>
        <ItemKey onClick={() => setIsOpen((open) => !open)}>
          <motion.span layout="position">{key}</motion.span>
          <ExpandIcon>{isOpen ? '-' : '+'}</ExpandIcon>
        </ItemKey>
        {isOpen && (
          <List>
            {validEntries.map(([key, value]) => {
              const currentPath = [...newPath, key]
              return (
                <Entry
                  key={currentPath.join('.')}
                  item={[key, value]}
                  path={currentPath}
                  depth={depth + 1}
                />
              )
            })}
          </List>
        )}
      </ListItem>
    )
  }

  return (
    <ListItem tw="flex space-x-2">
      <ItemKey>{key}:</ItemKey>
      <motion.p layout="position">{toText(value)}</motion.p>
    </ListItem>
  )
}

// -- Helper components --

function ListItem(props) {
  return (
    <motion.li
      tw="pl-4"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      layout="position"
      {...props}
    />
  )
}

function ItemKey(props) {
  if (props.onClick) {
    return (
      <motion.button
        layout="position"
        tw="text-gray-600 relative dark:text-gray-400"
        {...props}
      />
    )
  }
  return (
    <motion.p
      layout="position"
      tw="text-gray-600 relative dark:text-gray-400"
      {...props}
    />
  )
}

function ExpandIcon(props) {
  return (
    <motion.span
      tw="w-4 h-4 font-semibold flex items-center justify-center absolute -right-6 top-1/2 transform -translate-y-1/2"
      {...props}
    />
  )
}

// -- Helper functions --

/**
 * Properties in the whitelist provide context — e.g. for an Identifier node, we also
 * want to know what the name of the Identifier is.
 */
const Whitelist = new Set(['type', 'kind', 'value', 'name', 'operator'])

/**
 * Given a property of an AST node, check if that property should be rendered or not.
 * Generally speaking, we only want to render if the property is in the whitelist or
 * if the property is itself an AST node.
 */
function isVisible([key, value]) {
  if (Whitelist.has(key)) {
    return true
  }

  /**
   * typeof null === 'object', so we have to check if the value is truthy
   * before checking if it's an object or not.
   */
  if (value && typeof value === 'object') {
    /**
     * Only render the array if it's an array of AST nodes.
     */
    if (Array.isArray(value)) {
      const [first] = value
      if (first && typeof first === 'object' && !Array.isArray(first)) {
        return first.hasOwnProperty('type')
      }
      return false
    } else {
      return value.hasOwnProperty('type')
    }
  }

  return false
}

function toText(item) {
  const lookup = {
    number: item,
    string: `"${item}"`,
  }
  return lookup[typeof item]
}

// -- Styled components --

const List = styled(motion.ul).attrs({ layout: 'position' })`
  list-style: none !important;
  will-change: transform;
`
