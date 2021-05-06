export default async function handler(req, res) {
  const { email } = req.query

  const response = await fetch(`https://api.buttondown.email/v1/subscribers`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.BUTTON_DOWN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (response.ok) {
    return res.status(201).end()
  }

  const { email: errors } = await response.json()
  return res.status(400).json({ errors })
}
