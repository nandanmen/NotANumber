import React from 'react'
import { BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi'

import { styled } from '@/stitches'
import { Slider } from './Slider'

export function Controls({ player: { models, actions } }) {
  return (
    <ControlsWrapper>
      <ControlButton onClick={actions.toggle}>
        {models.isPlaying ? (
          <BsPauseFill size="20px" />
        ) : (
          <BsPlayFill size="20px" />
        )}
      </ControlButton>
      <Slider
        type="range"
        min={0}
        max={models.steps.length - 1}
        value={models.activeStepIndex}
        onChange={(evt) => actions.setIndex(evt.target.valueAsNumber)}
      />
      <StepWrapper>
        <ControlButton onClick={actions.prev}>
          <HiArrowLeft />
        </ControlButton>
        <ControlButton onClick={actions.next}>
          <HiArrowRight />
        </ControlButton>
      </StepWrapper>
    </ControlsWrapper>
  )
}

const ControlsWrapper = styled('div', {
  display: 'flex',
  gap: '16px',
  width: '100%',
})

const StepWrapper = styled('div', {
  display: 'flex',
  gap: '8px',
})

const ControlButton = styled('button', {
  width: '$8',
  height: '$8',
  borderRadius: '6px',
  background: '$grey200',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})
