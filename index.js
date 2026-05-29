require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = [];

app.post('/api/shorturl', function(req, res) {
  let url = req.body.url;

  if(!/^https?:\/\/.+/i.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = urls.length + 1;

  urls.push({ original_url: url, short_url: shortUrl });
  res.json({ original_url: url, short_url: shortUrl });
  
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = Number(req.params.short_url);
  const urlData = urls.find(u => u.short_url === shortUrl);

  if (!urlData) {
    return res.json({ error: 'No short URL found' });
  }
res.redirect(urlData.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
