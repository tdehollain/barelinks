const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ region: 'eu-west-1', apiVersion: '2012-08-10' });

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
			err: err,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		});
	}
};

async function getLinksForUser(user, linksPerPage, page) {
	let tableParams = {
		TableName: 'Barelinks-links',
		ExpressionAttributeNames: {
		    "#user": "user",
		},
		ExpressionAttributeValues: {
			":user": {
				S: user
			}
		},
		FilterExpression: "#user = :user"
	};

	try {
		let res = await ddb.scan(tableParams).promise();
		res = res.Items;
		let totalCount = res.length;
		return { success: true, list: res, totalCount };
	} catch(err) {
		return { success: false, error: err };
	}
}