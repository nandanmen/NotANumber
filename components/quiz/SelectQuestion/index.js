import React from 'react'
import tw, { styled } from 'twin.macro'

function SelectQuestion({ options }) {
  const [activeAnswer, setActiveAnswer] = React.useState(null)

  return (
    <List>
      {options.map((option) => (
        <Option key={option.value} active={option === activeAnswer}>
          <button onClick={() => setActiveAnswer(option)}>
            {option.value}
          </button>
        </Option>
      ))}
      {activeAnswer && <Answer>{activeAnswer.hint}</Answer>}
    </List>
  )
}

export default SelectQuestion

const List = styled.ul`
  list-style: none !important;
  padding: 0 !important;
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.5rem;
`

const Option = styled.li`
  flex: 1;
  margin: 0 !important;

  button {
    ${tw`block w-full rounded-lg`};

    padding: 1rem;
    font-weight: 600;

    ${({ active }) =>
      active
        ? tw`text-white bg-blue-600`
        : tw`bg-gray-200 dark:bg-blacks-500 hover:(bg-blue-600 text-white)`}
  }
`

const Answer = styled.li`
  width: 100%;
  margin-top: 1rem;
`
