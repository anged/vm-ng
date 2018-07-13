const express  = require('express');
const url = require('url');
const op = require('../dist/options.js');

const oembedUrl = 'https://maps.vilnius.lt';
const oembedTitle = 'Vilniaus miesto interaktyvūs žemėlapiai';
const oembedDescription = 'Vilniaus miesto savivaldybės interaktyvūs žemėlapiai';
const  themes = op.MapOptions.themes;

const app = express();

app.set('view engine', 'ejs');

app.use("/app", express.static(__dirname + '/../app'));
app.use("/dist", express.static(__dirname + '/../dist'));

app.get('*', (req, res) => {
  const pathname = url.parse(req.url, parseQueryString=false).pathname;
	if (pathname.slice(1)) {
		for (theme in themes) {
			if (themes[theme].id === pathname.slice(1)) {
				console.log('\x1b[33m%s\x1b[0m', `themes' id ${themes[theme].id}`);
				res.render('index.ejs', {
					oembedUrl: oembedUrl + req.url,
					oembedDescription: `${themes[theme].description} `,
					oembedTitle: `${themes[theme].name} / ${oembedTitle}`
				 });
			}

		}

	} else {
		res.render('index.ejs', {
			oembedUrl: oembedUrl + req.url,
			oembedDescription,
			oembedTitle
		 });
	}

});

app.listen(80);
