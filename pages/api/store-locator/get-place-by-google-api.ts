import googlePlaceAutocomplete from '@framework/store-locator/get-place-by-google-api'

export default async (req: any, res: any) => {
  const { input } = req.query
  try {
    const response = await googlePlaceAutocomplete(input)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
