import commerce from '@lib/api/commerce'

export default async (req: any, res: any) => {
  console.log(req.body, 'body')
  try {
    const response = await commerce.getAllProducts({
      query: req.body,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}
