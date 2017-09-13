
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

	const userSchema = new mongoose.Schema({
		user: String,
		tags: [{
			name: String,
			color: String,
			count: Number
		}]
	});

	const urlListModel = mongoose.model('urlListModel', urlListSchema, 'urlListColl')
	const userModel = mongoose.model('userModel', userSchema, 'userColl')

	const post = async (entry, done) => {
		let entryModel = new urlListModel({
			user: entry.user,
			url: entry.url,
			title: entry.title,
			date: entry.date
		});

		await entryModel.save()
		console.log("New entry saved: (" + entry.date + ") " + entry.url);
		done();
	};

	const get = function(user, page, resultsPerPage, done) {
		let theList = {};
		urlListModel
			.find({user: user})
			.skip((page - 1) * resultsPerPage)
			.limit(parseInt(resultsPerPage))
			.sort('-date')
			.exec((err, res) => {
				let links = res;
				let linksCount = links.length;
				let endOfList = (page)*resultsPerPage >= linksCount ? true : false;
				done(links, linksCount, endOfList);
			});
	};

	const getTags = async (user, done) => {
			let res = await userModel.find({ user: user });
			let tags = res[0].tags;
			done(tags);
	}

	const getLinksByTagName = function(user, tagName, page, resultsPerPage, done) {
		let theList = {};
		urlListModel
			.find({user: user, "tags.name": tagName})
			.skip((page - 1) * resultsPerPage)
			.limit(parseInt(resultsPerPage))
			.sort('-date')
			.exec((err, res) => {
				let links = res;
				let linksCount = links.length;
				let endOfList = (page)*resultsPerPage >= linksCount ? true : false;
				done(links, linksCount, endOfList);
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

		// Add tag to the URL list collection
		urlListModel.update(
			{ _id: mongoose.Types.ObjectId(id) }, 
			{ $push: { tags: newTag } }, 
			(err, link) => {
				// update tags count
				userModel.findOne(
					{ user: user },
					(err, res) => {
						let userTags = res.tags;

						let tagAlreadyPresent = false;
						userTags.map((tag, index) => {
							if(tag.name === tagName & tag.color === tagColor) {
								tagAlreadyPresent = true;
								userModel.update(
									{ user: user, "tags.name": tagName },
									{ $inc: { "tags.$.count": 1 }},
									(err, res) => {
										done();
									}
								);
							}
						});

						if(!tagAlreadyPresent) {
							userModel.update(
								{ user: user },
								{ $push: { tags: { name: tagName,	color: tagColor, count: 1 } } },
								(err, user) => {
									done();
								}
							);
						}
					}
				);
			}
		);
	};

	const removeTag = function(user, id, tagName, tagColor, done) {
		urlListModel.update(
			{ _id: mongoose.Types.ObjectId(id) }, 
			{ $pull: { tags: { name: tagName } } }, 
			(err, link) => { 
				userModel.update(
					{ user: user, "tags.name": tagName, "tags.color": tagColor },
					{ $inc: { "tags.$.count": -1 }},
					(err, res) => {
						done();
					}
				);
			}
		);
	}

	return {
		url: url,
		post: post,
		get: get,
		getTags: getTags,
		getLinksByTagName: getLinksByTagName,
		del: del,
		addTag: addTag,
		removeTag, removeTag
	};

};