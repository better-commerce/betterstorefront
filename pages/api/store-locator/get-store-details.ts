import getStoreDetails from '@framework/storeLocator/getStoreDetails';

export default async (req:any, res:any) => {
  const { storeId } = req.query;
  try {
    const response = await getStoreDetails(storeId);
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}