import React from 'react'
import { HiArrowLeft, HiArrowRight, HiPencil, HiX } from 'react-icons/hi'
import { AnimatePresence } from 'framer-motion'

import { styled, css } from '@/stitches'
import usePlayer from '@/lib/usePlayer'

import { Button } from './Button'
import { PlayButton } from './PlayButton'
import { SaveFormButton } from './SaveFormButton'

type AnimationWrapperProps = {
  children: React.ReactNode
  player: ReturnType<typeof usePlayer>
  controls: boolean
  editable: boolean
  showForm?: boolean
  onShowForm?: () => void
  onSubmitForm?: () => void
}

export function StaticVisual({ children }: { children: React.ReactNode }) {
  return (
    <Content>
      <AlgorithmWrapper>{children}</AlgorithmWrapper>
    </Content>
  )
}

export function AnimationWrapper({
  children,
  player,
  controls,
  editable,
  showForm,
  onShowForm,
  onSubmitForm,
}: AnimationWrapperProps) {
  const { activeStepIndex, steps, isPlaying } = player.models
  const isDone = activeStepIndex === steps.length - 1
  return (
    <Content>
      <AlgorithmWrapper>{children}</AlgorithmWrapper>
      <ControlsWrapper>
        <StepButtons>
          {steps.length > 1 && (
            <>
              <PlayButton
                className={css({ marginRight: '0.25rem' })()}
                state={isDone ? 'done' : isPlaying ? 'playing' : ''}
                onClick={player.actions.toggle}
              />
              {controls && (
                <>
                  <Button
                    css={{ marginRight: '0.25rem' }}
                    onClick={player.actions.prev}
                    disabled={activeStepIndex === 0}
                  >
                    <HiArrowLeft />
                  </Button>
                  <Button
                    css={{ marginRight: '0.25rem' }}
                    onClick={player.actions.next}
                    disabled={isDone}
                  >
                    <HiArrowRight />
                  </Button>
                </>
              )}
            </>
          )}
        </StepButtons>
        {editable && (
          <FormControls>
            <AnimatePresence>
              {showForm && <SaveFormButton onClick={onSubmitForm} />}
            </AnimatePresence>
            <Button onClick={onShowForm} css={{ position: 'relative' }}>
              {showForm ? <HiX /> : <HiPencil />}
            </Button>
          </FormControls>
        )}
      </ControlsWrapper>
      {steps.length > 1 && (
        <StepCounter>
          {activeStepIndex + 1} / {steps.length}
        </StepCounter>
      )}
    </Content>
  )
}

const StepCounter = styled('p', {
  position: 'absolute',
  color: '$grey600',
  right: '$5',
  top: '$4',
})

const FormControls = styled('div', {
  display: 'flex',
  '> :not(:last-child)': {
    marginRight: '$1',
  },
})

const AlgorithmWrapper = styled('div', {
  padding: '$16 0',
  zIndex: 0,
})

const ControlsWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  color: '$grey600',
})

const StepButtons = styled('div', {
  display: 'flex',
})

const Content = styled('div', {
  position: 'relative',
  zIndex: 2,
  padding: '$4',
  background: '$grey200',
  border: '2px solid $grey300',

  '@md': {
    borderRadius: '8px',
  },
})
