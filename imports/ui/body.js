import { Template } from 'meteor/templating';

import { Links } from '../api/links.js';

import { Tracker } from 'meteor/tracker';

import '../api/links.js';
import './body.html';

linksPerPage = 50;


// if (Meteor.isClient) {
//   Accounts.onLogin(function () {
// 		console.log("User logged in: " + Meteor.user.username);
// 	});
// }

Template.body.onRendered(function(){
   this.autorun(function(){
     Template.currentData();
   });
});

// Template.loginButtons.rendered = function() {
// 	Tracker.autorun(function() {
// 		if(Meteor.userId) {
// 			console.log("User logged in: " + Meteor.user);
// 		}
// 	});
// };


Template.body.onCreated(function bodyOnCreated() {
	this.page = new ReactiveVar(1);
	this.query = new ReactiveVar("");
	Meteor.subscribe('links', Meteor.userId());
});



Template.body.helpers({
	user: {
		count: function() {
			return Links.find({ user: Meteor.userId() }).count();
		}
	},
	links: function() {
		var nbSkip = linksPerPage*(Template.instance().page.get() - 1);
		// var queryRegex = new RegExp(Template.instance().query.get(), 'i');
		return Links.find({ sort: { createdAt: -1 }, limit: linksPerPage, skip: nbSkip });
	// links: function() {
	// 	var nbSkip = linksPerPage*(Template.instance().page.get() - 1);
	// 	var queryRegex = new RegExp(Template.instance().query.get(), 'i');
	// 	return Links.find({ title: queryRegex }, { sort: { createdAt: -1 }, limit: linksPerPage, skip: nbSkip });
	},
	showPages: function() {
		var nbSkip = linksPerPage*(Template.instance().page.get() - 1);
		var queryRegex = new RegExp(Template.instance().query.get(), 'i');
		return Links.find({ user: Meteor.userId(), title: queryRegex }).count() > linksPerPage ? "" : "hidden";
	},
	currentPage: function() {
		return Template.instance().page.get();
	},
	maxPages: function() {
		var nbSkip = linksPerPage*(Template.instance().page.get() - 1);
		var queryRegex = new RegExp(Template.instance().query.get(), 'i');
		return Math.floor((Links.find({ user: Meteor.userId(), title: queryRegex }).count() - 1) / linksPerPage) + 1;
	}
});



Template.body.events({
	'submit #addLinkForm'(event) {
		event.preventDefault();

		var url = event.target.URL.value
		if(url !== "") {
			Meteor.call('addLink', Meteor.userId(), url, new Date());
		}

		// Clear text
		event.target.URL.value = '';
	},
	'click #previousBtn'(event) {
		var pageNb = Template.instance().page.get();
		if(pageNb>1) {
			Template.instance().page.set(pageNb - 1);
		}
	},
	'click #nextBtn'(event) {
		var pageNb = Template.instance().page.get();
		if(pageNb<Math.floor(Links.find({ user: Meteor.userId() }).count() / linksPerPage) + 1) {
			Template.instance().page.set(pageNb + 1);
		}
	},
	'click #searchIcon'(event) {
		$('#searchInput').toggleClass("expanded");
		if($('#searchInput').hasClass("expanded")) {
			$('#searchInput').focus();
			$('#searchIcon').attr('src', '/closeIcon.png');
		} else {
			Template.instance().query.set("");
			$('#searchInput').val("");
			$('#searchInput').blur();
			$('#searchIcon').attr('src', '/searchIcon.png');
		}
	},
	'keyup [name="search"]' (event, template) {
		let value = event.target.value.trim();

		// if(value!=='' && event.keyCode === 13) {
		// if(value!=='') {
			Template.instance().query.set(value);
		// }
	}
});



Template.link.events({
	'click .itemDeleteBtn'(event) {
		Meteor.call('removeLink', this._id);
	}
});



Template.registerHelper('isSuccess', function(success) {
	return success ? "success" : "failed";
});

Template.registerHelper('formatDate', function(date) {
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
	var day = date.getDate();
	var dayStr = day < 10 ? '0' + day : day;
	var month = date.getMonth();
	var monthStr = monthNames[month];
	var year = date.getFullYear();
	return dayStr + ' ' + monthStr + ' ' + year;
});