const request = require('request');
const cheerio = require('cheerio');

module.exports = function(router, db) {

	// server routes ========================================
	router.get('/api/get/:user/:page/:resultsPerPage', function(req, res) {
		db.get(req.params.user, req.params.page, req.params.resultsPerPage, function(list, count, endOfList) {
			var data = { list: list, count: count, endOfList: endOfList };
			res.json(data);
		});
	});

	router.get('/api/add/:user/:url/:date', function(req, res) {

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
		})

		// console.log("entry: " + JSON.stringify(entry));
		// console.log('type of date: ' + typeof entry.date);

	});

	router.delete('/api/delete/:user/:id', function(req, res) {
		db.del(req.params.user, req.params.id, function(err) {
			res.json({success: true});
		});
	});

	router.get('/api/addTag/:user/:linkId/:tagName/:tagColor', function(req, res) {
		db.addTag(req.params.user, req.params.linkId, req.params.tagName, req.params.tagColor, function() {
			res.json({ success: true });
		});
	});

	router.delete('/api/removeTag/:user/:linkId/:tagName', function(req, res) {
		db.removeTag(req.params.user, req.params.linkId, req.params.tagName, function() {
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
		let title = $('title').text();
		done(title);
	});
}