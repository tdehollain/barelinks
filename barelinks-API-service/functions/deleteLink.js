const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

const TableName = process.env.BARELINKS_TABLE;

exports.handler = async (event, context, callback) => {
  // if (!event.requestContext.authorizer) {
  // 	errorResponse('Authorization not configured', context.awsRequestId, callback);
  // 	return;
  // }

  console.log(JSON.stringify(event.body));
  const user = JSON.parse(event.body).user;
  const linkId = JSON.parse(event.body).linkId;

  try {
    let res = await deleteLink(user, linkId);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return callback(null, {
      statusCode: 500,
      err: err,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

async function deleteLink(user, linkId) {
  let tableParams = {
    TableName,
    Key: {
      userId: user,
      linkId: linkId
    }
  };

  try {
    let res = await ddb.delete(tableParams).promise();
    return { success: true, res };
  } catch (err) {
    return { success: false, error: JSON.stringify(err) };
  }
}
