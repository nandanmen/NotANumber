import { styled } from '@/stitches'
import { HiArrowRight } from 'react-icons/hi'

export function CachesIcon() {
  return (
    <Wrapper>
      <Grid>
        <Node>
          <Content dark>a</Content>
          <Arrow>
            <HiArrowRight />
          </Arrow>
        </Node>
        <Node shadow>
          <Content>1</Content>
        </Node>
        <Node>
          <Content dark>b</Content>
          <Arrow>
            <HiArrowRight />
          </Arrow>
        </Node>
        <Node shadow>
          <Content>2</Content>
        </Node>
      </Grid>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
})

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 48px)',
  gridTemplateRows: 'repeat(2, 48px)',
  rowGap: 8,
  columnGap: 16,
})

const Node = styled('div', {
  $$borderRadius: '$sizes$4',

  width: '$12',
  height: '$12',
  position: 'relative',

  variants: {
    shadow: {
      true: {
        '&:before': {
          content: '',
          position: 'absolute',
          background: `repeating-linear-gradient(
            -45deg,
            $colors$black,
            $colors$black 3px,
            transparent 3px,
            transparent 5px
          )`,
          inset: '$0',
          transform: 'translate(4px, 4px)',
          borderRadius: '$$borderRadius',
        },
      },
    },
  },
})

const Content = styled('div', {
  position: 'absolute',
  inset: '$0',
  background: '$background',
  border: '3px solid $black',
  borderRadius: '$$borderRadius',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '$lg',

  variants: {
    dark: {
      true: {
        background: '$black',
        color: '$white',
      },
    },
  },
})

const Arrow = styled('span', {
  position: 'absolute',
  left: 'calc(100% - 2px)',
  fontSize: '$lg',
  top: '50%',
  transform: 'translateY(-50%)',
})
