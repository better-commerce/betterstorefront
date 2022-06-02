import useNavTree from '@framework/api/endpoints/nav-tree'

export default async (req: any, res: any) => {
  const { cookies } = req
  try {
    const response: any = await useNavTree(cookies)
    res.status(200).json({ nav: response?.result?.header, footer: response?.result.footer })
  } catch (error) {
    res.status(500).json({ error })
  }
}
