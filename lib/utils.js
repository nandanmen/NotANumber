export function zip(...args) {
  const longest = args.reduce((a, b) => {
    return a.length > b.length ? a : b
  }, [])

  return longest.map((_, i) => {
    return args.map((array) => {
      return array[i] || array[array.length - 1]
    })
  })
}

export function formatPath(path) {
  return path.replace(/\.mdx$/, '')
}
