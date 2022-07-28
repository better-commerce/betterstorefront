import usePageContent from '@framework/content/use-page-content';

export default async (req: any, res: any) => {
  const { id, slug }: any = req.query
  try {
    const response = await usePageContent()({
      id,
      slug,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
