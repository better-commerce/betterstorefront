import axios from 'axios'

const GetLocationApiMiddleware = async (req: any, res: any) => {
  const url: any = process.env.GEO_ENDPOINT
  try {
    const { data }: any = await axios.get(url, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
};

export default GetLocationApiMiddleware;