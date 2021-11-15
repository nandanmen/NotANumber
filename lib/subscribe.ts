export function subscribe(email: string) {
  const params = new URLSearchParams({ email })
  return new Promise((resolve, reject) => {
    window.fetch(`/api/subscribe?${params}`).then((response) => {
      if (response.ok) {
        resolve(response)
      } else {
        reject(response)
      }
    })
  })
}
