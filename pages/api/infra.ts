import useInfra from '@framework/api/endpoints/infra'
export default async (req: any, res: any) => {
  try {
    const response = await useInfra(req)()
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
