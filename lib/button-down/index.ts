export * from './letters'

type RequestOptions<RequestBody> = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: RequestBody
  headers?: Record<string, string>
}

export function request<RequestBody>(opts: RequestOptions<RequestBody>) {
  const { url, method, body, headers = {} } = opts

  return new Promise<Response>((resolve, reject) => {
    fetch(`https://api.buttondown.email/v1${url}`, {
      method,
      headers: {
        Authorization: `Token ${process.env.BUTTON_DOWN_API_KEY}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: typeof body === 'object' ? JSON.stringify(body) : undefined,
    }).then((response) => {
      if (response.ok) {
        resolve(response)
      } else {
        reject(response)
      }
    })
  })
}
