import commerce from '@lib/api/commerce'

export default async (req: any, res: any) => {
  try {
    const response = await commerce.getAllProducts({
      query: JSON.stringify(req.query),
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
