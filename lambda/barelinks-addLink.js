const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
	// if (!event.requestContext.authorizer) {
	// 	errorResponse('Authorization not configured', context.awsRequestId, callback);
	// 	return;
	// }

	console.log('Received request to add link');
};


function errorResponse(errorMessage, awsRequestId, callback) {
	callback(null, {
		statusCode: 500,
		body: JSON.stringify({
			Error: errorMessage,
			Reference: awsRequestId,
		}),
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	});
}