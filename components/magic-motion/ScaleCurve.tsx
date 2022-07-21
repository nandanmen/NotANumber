import Figure from '@/elements/Figure'
import { styled } from '@/stitches'

import { Grid } from './Flip/shared/Grid'

export function ScaleCurve() {
  return (
    <Figure size="full">
      <VisualWrapper>
        <GridBackground rows={12} cols={20} />
        <GraphWrapper />
      </VisualWrapper>
    </Figure>
  )
}

const GridBackground = styled(Grid, {
  position: 'absolute',
  inset: '$0',
})

const VisualWrapper = styled('div', {
  aspectRatio: 20 / 12,
  position: 'relative',
})

const GraphWrapper = styled('div', {
  borderRadius: 6,
  width: '$32',
  aspectRatio: 1,
  background: '$grey100',
  border: '1px solid $grey300',
})
