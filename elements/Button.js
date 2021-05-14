import { motion } from 'framer-motion'
import tw, { styled } from 'twin.macro'

export default function Button(props) {
  return (
    <ButtonWrapper
      css={[props.disabled && tw`opacity-50 cursor-not-allowed`]}
      {...props}
    />
  )
}

const ButtonWrapper = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-weight: 600;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  background: var(--brown);

  &:focus {
    outline: none;
    background: var(--color-highlight-secondary);
    color: white;
  }
`
