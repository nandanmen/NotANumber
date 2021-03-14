import React from 'react'
import Editor from 'react-simple-code-editor'
import { motion } from 'framer-motion'
import { parse } from '@babel/parser'
import { highlight, languages } from 'prismjs/components/prism-core'
import tw, { styled } from 'twin.macro'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'

export default function AstSandbox({ initialCode = '' }) {
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
      <EditorWrapper>
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) => highlight(code, languages.js)}
        />
      </EditorWrapper>
      <div tw="overflow-y-scroll -mb-8 flex-1">
        <StyledTree tree={tree} />
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

function Tree({ className, tree }) {
  const visibleKeys = Object.entries(tree).filter(isVisible)
  return (
    <ul className={className}>
      {visibleKeys.map(([key, value]) => (
        <Entry key={key} item={[key, value]} path={[key]} />
      ))}
    </ul>
  )
}

function Entry({ item: [key, value], path = [] }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const newPath = [...path, key]

  if (Array.isArray(value)) {
    return (
      <ListItem>
        <ItemKey as="button" onClick={() => setIsOpen((open) => !open)}>
          {key}
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
        <ItemKey as="button" onClick={() => setIsOpen((open) => !open)}>
          {key}
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
      <p>{toText(value)}</p>
    </ListItem>
  )
}

function toText(item) {
  const lookup = {
    number: item,
    string: `"${item}"`,
  }
  return lookup[typeof item]
}

const ItemKey = tw(motion.p)`text-gray-600 relative`

const ListItem = tw(motion.li)`pl-4`

const List = styled.ul`
  position: relative;

  &:after {
    ${tw`bg-gray-200`}
    position: absolute;
    content: '';
    height: 100%;
    width: 2px;
    left: 0;
    top: 0;
  }
`

const StyledTree = styled(Tree)`
  > *:last-child {
    margin-bottom: 2rem;
  }
`

const EditorWrapper = styled.div`
  ${tw`flex-1 p-4 bg-white border-2 border-gray-300 rounded-xl`}

  .keyword {
    ${tw`italic text-green-600`}
  }

  .string {
    ${tw`text-yellow-600`}
  }

  .function {
    ${tw`text-green-600`}
  }
`

const ExpandIcon = tw.span`w-4 h-4 font-semibold flex items-center justify-center absolute -right-6 top-1/2 transform -translate-y-1/2`
