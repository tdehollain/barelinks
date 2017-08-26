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

	router.post('/api/add/:user/:url/:date', function(req, res) {

		getTitle(req.params.url, title => {

			let entry = {
				"user": req.params.user,
				"url": req.params.url,
				"title": title,
				"date": req.params.date
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

};

function getTitle(url, done) {
	request(url, (err, res, body) => {
		let $ = cheerio.load(body);
		let title = $('title').text();
		done(title);
	});
}