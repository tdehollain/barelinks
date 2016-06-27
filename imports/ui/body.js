import { Template } from 'meteor/templating';

import { Links } from '../api/links.js';

import { Tracker } from 'meteor/tracker';

import '../api/links.js';
import './body.html';

linksPerPage = 50;


Meteor.startup(function() {
	Meteor.subscribe('links');	
})

Template.body.onCreated(function bodyOnCreated() {
	this.page = new ReactiveVar(1);
	this.query = new ReactiveVar("");
});



Template.body.helpers({
	user: {
		count: function() {
			return Links.find().count();
		}
	},
	links: function() {
		var nbSkip = linksPerPage*(Template.instance().page.get() - 1);
		var queryRegex = new RegExp(Template.instance().query.get(), 'i');
		return Links.find({ title: queryRegex }, { sort: { createdAt: -1 }, limit: linksPerPage, skip: nbSkip });
	},
	showPages: function() {
		var nbSkip = linksPerPage*(Template.instance().page.get() - 1);
		var queryRegex = new RegExp(Template.instance().query.get(), 'i');
		return Links.find({ title: queryRegex }).count() > linksPerPage ? "" : "hidden";
	},
	currentPage: function() {
		return Template.instance().page.get();
	},
	maxPages: function() {
		var nbSkip = linksPerPage*(Template.instance().page.get() - 1);
		var queryRegex = new RegExp(Template.instance().query.get(), 'i');
		return Math.floor((Links.find({ title: queryRegex }).count() - 1) / linksPerPage) + 1;
	}
});



Template.body.events({
	'submit #addLinkForm'(event) {
		event.preventDefault();

		var url = event.target.URL.value;
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