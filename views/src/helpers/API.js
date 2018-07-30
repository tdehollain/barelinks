import AWSconfig from './AWSconfig';
import { Auth } from 'aws-amplify';

const getLinks = async function (user, linksPerPage, page) {
	let URL = AWSconfig.baseURL + '/link?user=' + user + '&linksPerPage=' + linksPerPage + '&page=' + page;
	let options = { method: 'GET' };
	let res = await fetch(URL, options);
	let list = await res.json();
	// console.log(list);
	return list;
};

const putLink = async function (user, url) {
	let URL = AWSconfig.baseURL + '/link';
	let accessToken = Auth.currentSession().accessToken;

	let options = {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			// "Authorization": accessToken
		},
		body: JSON.stringify({ user, url })
	};
	let res = await fetch(URL, options);
	let result = await res.json();
	return result;
}

const deleteLink = async function (user, id) {
	let URL = AWSconfig.baseURL + '/link';
	let options = {
		method: "DELETE",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			// "Authorization": accessToken
		},
		body: JSON.stringify({ user, linkId: id })
	}
	let res = await fetch(URL, options);
	let result = await res.json();
	return result;
}

export default {
	getLinks,
	putLink,
	deleteLink
}