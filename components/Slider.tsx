import { styled } from '@/stitches'

const thumbStyle = {
  height: '$6',
  width: '$6',
  borderRadius: '50%',
  cursor: 'pointer',
  background: '$brown',
  border: '2px solid $border',
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
