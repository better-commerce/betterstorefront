// server.js
const express = require('express');
const next = require('next');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Define your CORS whitelist
  const whitelist = ['https://liveocxcdn2.azureedge.net', 'https://cdnbs.bettercommerce.io','https://cdnbs.bettercommerce.tech'];
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };

  // Apply CORS middleware
  server.use(cors(corsOptions));

  // Handle all Next.js requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
