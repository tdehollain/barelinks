import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';
export const Links = new Mongo.Collection('links');

// to decode HTML entities
var Entities = require('html-entities').XmlEntities;
entities = new Entities();

if(Meteor.isServer) {
	Meteor.publish('links', function linksPublication() {
		return Links.find({ user: this.userId });
	});
}

Meteor.methods({
	'addLink'(user, url, createdAt) {
		var newId = Links.insert({
			user: user,
			url: url,
			title: url,
			createdAt: createdAt,
			success: "waiting",
		});

		// Add Title
		if (Meteor.isServer) {
			var options = {
				npmRequestOptions: {
					gzip: true,
					// headers: {
					// 	"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36",	
					// }
				}
			};
			HTTP.get(url, options, function(err, res) {
				if (err) {
					console.log(err);
					Links.update(newId, {
						$set: {
							title: "Error: could not load page",
							success: "failed"
						}
					});
				} else {
					var content = res.content;
					var str1 = content.substring(content.indexOf('<title'), content.indexOf('</title>'));
					var title = str1.substring(str1.indexOf(">") + 1);
					title = title.trim();

					// Convert HTML entities back ot text (", ', <, >, etc.)
					title = entities.decode(title);
					title = title.replaceAll("&raquo;", "»");
					title = title.replaceAll("&laquo;", "«");
					title = title.replaceAll("&rsquo;", "'");
					if (title === "") title = url;
					console.log(title);

					// Add title to Link entry in DB
					Links.update(newId, {
						$set: { 
							title: title,
							success: "success"
						}
					});
				}
			});

		}
	},
	'removeLink'(id) {
		Links.remove(id);
	}
});


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


