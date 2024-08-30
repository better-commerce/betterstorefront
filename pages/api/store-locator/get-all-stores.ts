import getAllStores from '@framework/store-locator/get-all-stores'

export default async (req:any, res:any) => {
  try {
    const response = await getAllStores(req?.cookies);
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}