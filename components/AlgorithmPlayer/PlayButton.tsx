import { BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { FaUndo } from 'react-icons/fa'
import { styled } from '@/stitches'

import { Button } from './Button'

type PlayButtonProps = {
  state: string
  onClick: () => void
  // TODO: Type this correctly
  className?: string
}

export function PlayButton({ className, state, onClick }: PlayButtonProps) {
  return (
    <Button className={className} onClick={onClick}>
      {state === 'playing' ? (
        <BsPauseFill />
      ) : state === 'done' ? (
        <Undo>
          <FaUndo />
        </Undo>
      ) : (
        <BsPlayFill />
      )}
    </Button>
  )
}

const Undo = styled('span', {
  fontSize: '$sm',
})
