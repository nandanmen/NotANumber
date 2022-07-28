import { LayoutGroup, motion } from 'framer-motion'
import { styled } from '@/stitches'
import Figure from '@/elements/Figure'
import { Grid } from './Flip/shared/Grid'

export function LayoutExample() {
  return (
    <Figure size="lg">
      <Wrapper>
        <Grid rows={10} cols={15} />
      </Wrapper>
    </Figure>
  )
}

const Wrapper = styled('div', {
  border: '1px solid $grey200',
})
