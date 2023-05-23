import commerce from '@lib/api/commerce'

const CancelReasonApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getCancelReason({
      query: req.body,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '60mb',
    }
  }
}

export default CancelReasonApiMiddleware;