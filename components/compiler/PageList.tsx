import { styled } from '@/stitches'

export function PageList() {
  return (
    <List>
      <ListItem>The Terrific Tokenizer</ListItem>
      <ListItem>A Patient Parser and the Intricacies of console.log</ListItem>
      <ListItem>Vexing Visitors and Clunky Code Generation</ListItem>
      <ListItem>Escaping Errors Elegantly</ListItem>
      <ListItem>Variables, Literals, and Assignments</ListItem>
    </List>
  )
}

const List = styled('ol', {
  background: '$black',
  padding: '$8',
  color: '$white',
  flex: 1,
  flexShrink: 0,
  borderRadius: 12,
  counterReset: 'list',
})

const ListItem = styled('li', {
  '&:before': {
    position: 'absolute',
    left: 0,
    content: `counter(list, upper-roman)`,
  },

  position: 'relative',
  counterIncrement: 'list',
  paddingLeft: '$12',
})
