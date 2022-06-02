// import useNavTree from '@framework/api/endpoints/nav-tree'
import getNavTree from '@framework/api/content/getNavTree'

export default async (req: any, res: any) => {
  try {
    // const response: any = await useNavTree(cookies)
    // res.status(200).json({ nav: response?.result?.header, footer: response?.result?.footer })
    const response = await getNavTree(req.cookies)
    res.status(200).json({ nav: response.header, footer: response.footer })
  } catch (error) {
    res.status(500).json({ error })
  }
}
