import faunadb from 'faunadb'

const FEEDBACK_INDEX = 'feedback_by_slug'
const FEEDBACK_COLLECTION = 'feedback'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = faunadb.query
    const client = new faunadb.Client({
      secret: process.env.FAUNA_SECRET_KEY,
    })

    const { slug, message, name } = req.query

    if (!slug) {
      return res.status(400).json({
        message: 'Article slug not provided',
      })
    }

    const doesDocExist = await client.query(
      db.Exists(db.Match(db.Index(FEEDBACK_INDEX), slug))
    )

    if (!doesDocExist) {
      await client.query(
        db.Create(db.Collection(FEEDBACK_COLLECTION), {
          data: {
            slug,
            feedback: [],
          },
        })
      )
    }

    const doc = await client.query(
      db.Get(db.Match(db.Index(FEEDBACK_INDEX), slug))
    )

    await client.query(
      db.Update(doc.ref, {
        data: { feedback: [...doc.data.feedback, { message, name }] },
      })
    )

    return res.status(200).json({ feedback: doc.data.feedback })
  }
  return res.status(404).end()
}
