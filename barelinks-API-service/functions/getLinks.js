const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

exports.handler = async (event, context, callback) => {
	// if (!event.requestContext.authorizer) {
	// 	errorResponse('Authorization not configured', context.awsRequestId, callback);
	// 	return;
	// }

	let user = event.queryStringParameters.user;
	let linksPerPage = event.queryStringParameters.linksPerPage;
	let page = event.queryStringParameters.page;
	//user=user&linksPerPage=50&page=1
	
	try {
		let links = await getLinksForUser(user, linksPerPage, page);
		return callback(null, {
			statusCode: 200,
			body: JSON.stringify(links),
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		});
	} catch(err) {
		return callback(null, {
			statusCode: 500,
			body: JSON.stringify(err),
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		});
	}
};

async function getLinksForUser(user, linksPerPage, page) {
	let tableParams = {
		TableName: 'Barelinks',
		ExpressionAttributeValues: {
			":userId": user
		},
		FilterExpression: "userId = :userId"
	};

	try {
		let res = await ddb.scan(tableParams).promise();
		let linksList = res.Items;
		let totalCount = linksList.length;
		console.log("totalCount: " + totalCount);
		// Sort list by date
		let sortedList = linksList.sort((a,b) => {
			return (new Date(b.date) - new Date(a.date));
		});
		// keep only the right page
		let pagedList = sortedList.slice((page - 1)*linksPerPage, page*linksPerPage);
		console.log("number of results: " + pagedList.length);
		return { success: true, list: pagedList, totalCount };
	} catch(err) {
		return { success: false, error: err };
	}
}