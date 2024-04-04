import getAddressDetailByPlaceId from '@framework/storeLocator/getAddressDetailByPlaceId'

export default async (req: any, res: any) => {
  const { placeId } = req.query
  try {
    const response = await getAddressDetailByPlaceId(placeId)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
