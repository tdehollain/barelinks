
module.exports = function(mongoose){

	const url = 'mongodb://localhost:9001/barelinksDB';

	const urlListSchema = new mongoose.Schema({
		user: String,
		url: String,
		title: String,
		date: Date,
		tags: [{
			name: String,
			color: String
		}]
	});

	const urlListModel = mongoose.model('urlListModel', urlListSchema, 'urlListColl')

	const post = function(entry, done) {
		let entryModel = new urlListModel({
			user: entry.user,
			url: entry.url,
			title: entry.title,
			date: entry.date
		});
		entryModel.save(err => {
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
			.exec((err, res) => {
				let count = res.length;
				let endOfList = (page)*resultsPerPage >= count ? true : false
				done(res, count, endOfList);
			});
	};

	const del = function(user, id, done) {
		urlListModel.remove({_id: id}, err => {
			console.log("entry deleted: " + id);
			done(err);
		});
	};

	const addTag = function(user, id, tagName, tagColor, done) {
		let newTag = {
			"name": tagName,
			"color": tagColor
		}
		urlListModel.update(
			{ _id: mongoose.Types.ObjectId(id) }, 
			{ $push: { tags: newTag } }, 
			(err, link) => {
				done();
			}
		);
	};

	const removeTag = function(user, id, tagName, done) {
		urlListModel.update(
			{ _id: mongoose.Types.ObjectId(id) }, 
			{ $pull: { tags: { name: tagName } } }, 
			(err, link) => { done(); }
		);
	}

	return {
		url: url,
		post: post,
		get: get,
		del: del,
		addTag: addTag,
		removeTag, removeTag
	};

};