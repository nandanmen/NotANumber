import { BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { FaUndo } from 'react-icons/fa'

import { Button } from './Button'

type PlayButtonProps = {
  state: string
  onClick: () => void
  // TODO: Type this correctly
  css?: any
}

export function PlayButton({ css, state, onClick }: PlayButtonProps) {
  return (
    <Button css={css} onClick={onClick}>
      {state === 'playing' ? (
        <BsPauseFill />
      ) : state === 'done' ? (
        <span tw="text-sm">
          <FaUndo />
        </span>
      ) : (
        <BsPlayFill />
      )}
    </Button>
  )
}
