import commerce from '@lib/api/commerce'

const CreateAddressApiMiddleware =  async (req: any, res: any) => {
  try {
    const response = await commerce.createAddress({
      query: req.body,
      cookie: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
};

export default CreateAddressApiMiddleware;