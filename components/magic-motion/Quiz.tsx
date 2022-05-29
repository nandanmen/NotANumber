import React from 'react'
import { motion } from 'framer-motion'
import { yellow, green } from '@radix-ui/colors'

import { styled } from '@/stitches'
import Figure from '@/elements/Figure'

type IAnswer = {
  label: string
  tip: string
  correct?: boolean
}

type QuizProps = {
  question: string
  answers: IAnswer[]
}

export function Quiz({ question, answers = [] }: QuizProps) {
  const [activeAnswer, setActiveAnswer] = React.useState<IAnswer | null>(null)
  const selected = activeAnswer !== null
  return (
    <Figure>
      <Wrapper withTip={selected}>
        <Title>{question}</Title>
        <Answers>
          {answers.map((answer) => (
            <Answer key={answer.label}>
              <AnswerButton
                onClick={() => setActiveAnswer(answer)}
                selected={answer === activeAnswer}
              >
                {answer.label}
              </AnswerButton>
            </Answer>
          ))}
        </Answers>
      </Wrapper>
      {activeAnswer && (
        <Tip
          correct={activeAnswer.correct}
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: -16, opacity: 0 }}
        >
          {activeAnswer.tip}
        </Tip>
      )}
    </Figure>
  )
}

const correctStyles = {
  background: green.green4,
  border: `1px solid ${green.green7}`,
}

const incorrectStyles = {
  background: yellow.yellow4,
  border: `1px solid ${yellow.yellow7}`,
}

const Wrapper = styled('div', {
  background: '$grey200',
  border: '1px solid $grey300',
  padding: '$6',
  borderRadius: 6,

  variants: {
    withTip: {
      true: {
        paddingBottom: 48,
      },
    },
  },
})

const Answers = styled('ul', {
  display: 'flex',
  gap: '$3',
  marginTop: '$4',
})

const Answer = styled('li', {
  flex: 1,
})

const AnswerButton = styled('button', {
  display: 'block',
  background: '$white',
  borderRadius: 4,
  border: '1px solid $grey400',
  textAlign: 'center',
  padding: '$1',
  width: '100%',

  '&:hover': {
    background: '$teal',
    border: '1px solid $black',
  },

  variants: {
    selected: {
      true: {
        background: '$teal',
        border: '1px solid $black',
      },
    },
  },
})

const Title = styled('h1', {})

const Tip = styled(motion.p, {
  padding: '$2',
  borderRadius: 6,
  marginTop: -32,
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 'calc(100% - $space$12)',
  ...incorrectStyles,

  variants: {
    correct: {
      true: {
        ...correctStyles,
      },
    },
  },
})
