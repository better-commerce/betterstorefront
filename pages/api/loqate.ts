import { loqateUser } from '@framework/checkout'

const LoqateUserApiMiddleWare = async (req: any, res: any) => {
  const { postCode, country }: any = req.body
  try {
    const response = await loqateUser()({
      postCode,
      country,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
};

export default LoqateUserApiMiddleWare;