const request = require('request');
const cheerio = require('cheerio');

module.exports = function(router, db) {

	// server routes ========================================

	router.get("/", (req, res) => {
		res.sendFile(path.join(__dirname, 'views/build', 'index.html'));
	});

	router.get('/api/get/:user/:page/:resultsPerPage', (req, res) => {
		db.get(req.params.user, req.params.page, req.params.resultsPerPage, (list, count, endOfList) => {
			let data = { list: list, count: count, endOfList: endOfList };
			res.json(data);
		});
	});

	router.get('/api/getCommonTags/:user', (req, res) => {
		db.getCommonTags(req.params.user, tags => {
			res.json(tags);
		});
	});

	router.put('/api/add/:user/:url/:date', (req, res) => {

		getTitle(req.params.url, title => {

			let entry = {
				"user": req.params.user,
				"url": req.params.url,
				"title": title,
				"date": req.params.date,
				"tags": []
			};

			db.post(entry, function(err) {
				res.json({
					title: entry.title,
					success: true
				});
			});
		});

	});

	router.delete('/api/delete/:user/:id', (req, res) => {
		db.del(req.params.user, req.params.id, err => {
			res.json({success: true});
		});
	});

	router.put('/api/addTag/:user/:linkId/:tagName/:tagColor', (req, res) => {
		db.addTag(req.params.user, req.params.linkId, req.params.tagName, req.params.tagColor, () => {
			res.json({ success: true });
		});
	});

	router.delete('/api/removeTag/:user/:linkId/:tagName/:tagColor', (req, res) => {
		db.removeTag(req.params.user, req.params.linkId, req.params.tagName, req.params.tagColor, () => {
			res.json({ success: true });
		});
	});

};

function getTitle(url, done) {
	let requestOptions = {
		"url": url,
		"headers": {
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36"
		}
	}
	request(url, (err, res, body) => {
		let $ = cheerio.load(body);
		let title = $('head title').text();
		done(title);
	});
}