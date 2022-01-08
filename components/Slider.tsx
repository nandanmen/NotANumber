import { styled } from '@/stitches'
import { blue } from '@radix-ui/colors'

const thumbStyle = {
  height: '$6',
  width: '$6',
  borderRadius: '50%',
  cursor: 'pointer',
  background: blue.blue8,
  border: '2px solid $border',
}

const trackStyle = {
  height: '4px',
  background: '$grey200',
}

export function Slider(props) {
  return <SliderWrapper type="range" {...props} />
}

const SliderWrapper = styled('input', {
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
