import getAddressDetailByPlaceId from '@framework/store-locator/get-address-detail-by-place-id'

export default async (req: any, res: any) => {
  const { placeId } = req.query
  try {
    const response = await getAddressDetailByPlaceId(placeId, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
