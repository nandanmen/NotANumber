function SelectQuestion({ children }) {
  return <ul>{children}</ul>
}

SelectQuestion.Option = function SelectQuestionOption({ value, children }) {
  return (
    <li>
      <button>{value}</button>
      <div>{children}</div>
    </li>
  )
}

export default SelectQuestion
