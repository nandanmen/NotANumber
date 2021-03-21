import React from 'react'
import { motion, AnimateSharedLayout } from 'framer-motion'
import { parse } from '@babel/parser'
import { styled } from 'twin.macro'

import LiveEditor from './LiveEditor'

export default function AstSandbox({ initialCode = '', depth = 2 }) {
  const [code, setCode] = React.useState(initialCode)
  const [tree, setTree] = React.useState(parse(initialCode))

  React.useEffect(() => {
    try {
      const tree = parse(code)
      setTree(tree)
    } catch {
      // syntax error
    }
  }, [code])

  return (
    <>
      <div tw="flex-1">
        <LiveEditor value={code} onValueChange={(code) => setCode(code)} />
      </div>
      <div tw="flex-1">
        <Tree tree={tree} depth={depth} />
      </div>
    </>
  )
}

const isVisible = ([key, value]) => {
  const whitelist = new Set(['type', 'kind', 'value', 'name', 'operator'])
  if (whitelist.has(key)) {
    return true
  }
  if (value && typeof value === 'object') {
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

const TreeContext = React.createContext()

const useTreeContext = () => React.useContext(TreeContext)

function Tree({ className, tree, depth = 2 }) {
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

function Entry({ item: [key, value], path = [], depth }) {
  const { depth: initialDepth } = useTreeContext()
  const [isOpen, setIsOpen] = React.useState(depth <= initialDepth)
  const newPath = [...path, key]

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

function toText(item) {
  const lookup = {
    number: item,
    string: `"${item}"`,
  }
  return lookup[typeof item]
}

const List = styled(motion.ul).attrs({ layout: 'position' })`
  list-style: none !important;
  will-change: transform;
`
