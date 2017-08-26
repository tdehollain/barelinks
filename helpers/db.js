
module.exports = function(mongoose){
	const url = 'mongodb://localhost/barelinksDB';

	const urlListSchema = new mongoose.Schema({
		user: String,
		url: String,
		title: String,
		date: Date
	});

	const urlListModel = mongoose.model('urlListModel', urlListSchema, 'urlListColl')

	const post = function(entry, done) {

		let entryModel = new urlListModel({
			user: entry.user,
			url: entry.url,
			title: entry.title,
			date: entry.date
		});

		entryModel.save(function(err) {
			console.log("New entry saved: (" + entry.date + ") " + entry.url);
			done(err);
		});
	};

	const get = function(user, page, resultsPerPage, done) {
		let theList = {};
		urlListModel
			.find({user: user})
			.skip((page - 1) * resultsPerPage)
			.limit(parseInt(resultsPerPage))
			.sort('-date')
			.select('date url title _id')
			.exec(function(err, res) {
				let count = res.length;
				let endOfList = (page)*resultsPerPage >= count ? true : false
				done(res, count, endOfList);
			});
	};

	const del = function(user, id, done) {
		urlListModel.remove({_id: id}, function(err) {
			console.log("entry deleted: " + id);
			done(err);
		});
	};

	return {
		url: url,
		post: post,
		get: get,
		del: del
	};
};