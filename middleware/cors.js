// middleware/cors.js

import { NextApiResponse } from 'next';

// List of allowed domains
const whitelist = ['https://liveocxcdn2.azureedge.net', 'https://cdnbs.bettercommerce.io'];

export default function handler(req, res) {
  const origin = req.headers.origin;

  if (!origin || !whitelist.includes(origin)) {
    return res.status(403).json({ error: 'Not allowed by CORS' });
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Proceed with the request
  // Example: res.status(200).json({ message: 'Hello from CORS-enabled Next.js API' });
}
