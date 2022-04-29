import { styled } from '@/stitches'
import Figure from '@/elements/Figure'

type Answer = {
  label: string
  tip: string
  correct?: boolean
}

type QuizProps = {
  question: string
  answers: Answer[]
}

export function Quiz({ question, answers = [] }: QuizProps) {
  return (
    <Figure size="lg">
      <Wrapper>
        <Title>{question}</Title>
        <ul>
          {answers.map((answer) => (
            <li>
              <button>{answer.label}</button>
            </li>
          ))}
        </ul>
      </Wrapper>
    </Figure>
  )
}

const Wrapper = styled('div', {
  background: '$grey200',
  border: '1px solid $black',
  padding: '$6',
  borderRadius: 6,
})

const Title = styled('h1', {
  fontSize: '$lg',
})
