import 'twin.macro'

export default function Dictionary({ entries, ...props }) {
  return (
    <ul tw="list-none text-center" {...props}>
      {Object.entries(entries).map(([key, val]) => (
        <li key={key} tw="flex mb-1 font-semibold">
          <p tw="flex-1 mr-1 text-white bg-gray-400 rounded-md dark:bg-blacks-300">
            {key}
          </p>
          <p tw="flex items-center justify-center flex-1 font-mono text-sm text-gray-500 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
            {val}
          </p>
        </li>
      ))}
    </ul>
  )
}
