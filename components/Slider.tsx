import { styled } from '@/stitches'

const thumbStyle = {
  height: '$6',
  width: '$6',
  borderRadius: '50%',
  cursor: 'pointer',
  background: '$brown',
  border: '1px solid $border',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
}

const trackStyle = {
  height: '4px',
  background: '$grey200',
}

export const Slider = styled('input', {
  '-webkit-appearance': 'none',
  width: '100%',
  background: 'transparent',

  '&::-webkit-slider-thumb': {
    '-webkit-appearance': 'none',
    marginTop: '-10px',
    ...thumbStyle,
  },

  '&::-moz-range-thumb': thumbStyle,
  '&::-webkit-slider-runnable-track': trackStyle,
  '&::-moz-range-track': thumbStyle,
})
