import commerce from '@lib/api/commerce'

const GetPdpLookbookProductApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getPdpLookbookProduct({
      query: req.body.slug,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
}

export default GetPdpLookbookProductApiMiddleware;