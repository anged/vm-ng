const express  = require('express');
const url = require('url');

const app = express();
const oembedUrl = 'https://maps.vilnius.lt';

app.set('view engine', 'ejs');

// app.get(['/', '/index.html'], (req, res) => {
//   res.render('index.ejs', { oembedUrl: oembedUrl + req.url });
//   console.log('URL', req.url)
// });

app.use("/app", express.static(__dirname + '/app'));
app.use("/dist", express.static(__dirname + '/dist'));

app.get('*', (req, res) => {
  const pathname = url.parse(req.url, parseQueryString=false).pathname;
  res.render('index.ejs', { oembedUrl: oembedUrl + req.url });
  console.log('URL', req.url);
  console.log('pathname', pathname);
});

app.listen(3003);
