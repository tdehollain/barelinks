
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

	const get = function(user, page, resultsPerPage, done) {
		// Get number of results
		urlListModel.find({user: user}, (err, docs) => {
			if(err){
				console.log('Error getting links for user' + user + ': ' + err);
			} else {
				let totalCount=docs.length;
				let commonTags = getCommonTags(docs);
				urlListModel
				.find({user: user})
				.skip((page - 1) * resultsPerPage)
				.limit(parseInt(resultsPerPage))
				.sort('-date')
				.exec((err, res) => {
					let links = res;
					let endOfList = page*resultsPerPage >= totalCount ? true : false;
					done(links, totalCount, endOfList, commonTags);
				});
			}
		})
	};

	const getLinksByTagName = function(user, tagName, page, resultsPerPage, done) {
		// Get number of results
		urlListModel.find({user: user, "tags.name": tagName}, (err, docs) => {
			if(err){
				console.log('Error getting links for user ' + user + ' and tag ' + tagName + ': ' + err);
			} else {
				let totalCount=docs.length;
				urlListModel
					.find({user: user, "tags.name": tagName})
					.skip((page - 1) * resultsPerPage)
					.limit(parseInt(resultsPerPage))
					.sort('-date')
					.exec((err, res) => {
						let links = res;
						let endOfList = (page)*resultsPerPage >= totalCount ? true : false;
						done(links, totalCount, endOfList);
					});
			}
		});
	};

	const getLinksBySearchTerm = function(user, searchTerm, page, resultsPerPage, done) {
		// Get number of results
		urlListModel.find({user: user, $or: [
				{ "tags.name": { "$regex": searchTerm, "$options": 'i' } },
				{ "title": { "$regex": searchTerm, "$options": 'i' } },
				{ "url": { "$regex": searchTerm, "$options": 'i' } } ]}
				, (err, docs) => {
			if(err){
				console.log('Error getting links for user ' + user + ' and search term ' + searchTerm + ': ' + err);
			} else {
				let totalCount=docs.length;
				urlListModel
					.find({user: user, $or: [
						{ "tags.name": { "$regex": searchTerm, "$options": 'i' } },
						{ "title": { "$regex": searchTerm, "$options": 'i' } },
						{ "url": { "$regex": searchTerm, "$options": 'i' } }
						]})
					.skip((page - 1) * resultsPerPage)
					.limit(parseInt(resultsPerPage))
					.sort('-date')
					.exec((err, res) => {
						let links = res;
						let endOfList = (page)*resultsPerPage >= totalCount ? true : false;
						done(links, totalCount, endOfList);
					});
			}
		});
	};

	const post = async (entry, done) => {
		let entryModel = new urlListModel({
			user: entry.user,
			url: entry.url,
			title: entry.title,
			date: entry.date
		});

		let savedEntry = await entryModel.save();
		console.log("New entry saved: (" + entry.date + ") " + entry.url);
		done(savedEntry);
	};

	const del = function(user, id, done) {
		urlListModel.remove({_id: id}, err => {
			console.log("entry deleted: " + id);
			done(err);
		});
	};

	const getTags = function(user, done) {
		urlListModel.find({user: user}, (err, docs) => {
			if(err){
				console.log('Error getting links for user' + user + ': ' + err);
			} else {
				let tags = getCommonTags(docs);
				done(tags);
			}
		});
	}

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
		getLinksBySearchTerm: getLinksBySearchTerm,
		del: del,
		addTag: addTag,
		removeTag, removeTag
	};

};

const getCommonTags = function(links) {
	let commonTags=[]
	for(let link of links) {
		for(let tag of link.tags) {
			let found = false;
			for(let [index, commonTag] of commonTags.entries()) {
				if(tag.name === commonTag.name && tag.color.toLowerCase() === commonTag.color.toLowerCase()) {
					found = true;
					commonTags = [
						...commonTags.slice(0, index),
						{ name: tag.name, color: tag.color, occurences: commonTag.occurences + 1 },
						...commonTags.slice(index + 1)
					];
				}
			}
			if(!found) {
				commonTags.push({ name: tag.name, color: tag.color, occurences: 1 });
			}
		}
	}
	
	return commonTags.sort((a,b) => b.occurences - a.occurences);
}