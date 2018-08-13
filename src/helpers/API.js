import awsConfig from '../utils/awsConfig';
import { Auth } from 'aws-amplify';

const getLinks = async (user, linksPerPage, page) => {
	let URL = awsConfig.APIbaseURL + '/link?user=' + user + '&linksPerPage=' + linksPerPage + '&page=' + page;
	let options = { method: 'GET' };
	let raw_response = await fetch(URL, options);
	let list = await raw_response.json();
	// console.log(list);
	return list;
};

const putLink = async (user, linkURL) => {
	let URL = awsConfig.APIbaseURL + '/link';
	let accessToken = Auth.currentSession().accessToken;

	let options = {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			// "Authorization": accessToken
		},
		body: JSON.stringify({ user, url: linkURL })
	};
	let raw_response = await fetch(URL, options);
	let result = await raw_response.json();
	return result;
}

const deleteLink = async (user, id) => {
	let URL = awsConfig.APIbaseURL + '/link';
	let options = {
		method: "DELETE",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			// "Authorization": accessToken
		},
		body: JSON.stringify({ user, linkId: id })
	}
	let raw_response = await fetch(URL, options);
	let result = await raw_response.json();
	return result;
}

const getTags = async (user) => {
	let URL = awsConfig.APIbaseURL + '/tags?user=' + user;
	let options = { method: 'GET' };
	let raw_response = await fetch(URL, options);
	let res = await raw_response.json();
	// console.log(res);
	return res.tags;
}

const addRemoveTag = async (username, tagDetails, action) => {
	let URL = awsConfig.APIbaseURL + '/link/tag';
	let options = {
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			// "Authorization": accessToken
		},
		body: JSON.stringify({
			user: username,
			action: action,
			...tagDetails
		})
	};
	let raw_response = await fetch(URL, options);
	let res = await raw_response.json();
	// console.log(list);
	return res.tags;
}

export default {
	getLinks,
	putLink,
	deleteLink,
	getTags,
	addRemoveTag
}