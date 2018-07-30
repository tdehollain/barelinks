const fetch = require('node-fetch');
const decode = require('unescape');

(async () => {
	let res = await getTitle('https://serverless.com/blog/running-scalable-reliable-graphql-endpoint-with-serverless/');
	console.log(res);
})();

async function getTitle(url) {
	try {
		let body = await fetch(url);
		let html = await body.text();
		let titleEnd = html.indexOf('</title>');
		if (titleEnd === -1) throw new Error('Error: </title> tag end not found');
		let tagStart = html.indexOf('<title');
		if (tagStart === -1) throw new Error('Error: <title> tag start not found');
		let titleStart = html.indexOf('>', tagStart) + 1;
		if (titleStart >= titleEnd) throw new Error('Error looking for title tag');

		let title = decode(html.substring(titleStart, titleEnd));
		return { success: true, title };
	} catch (err) {
		return { success: false, err };
	}
}