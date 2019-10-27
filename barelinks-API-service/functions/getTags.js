const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

exports.handler = async (event, context, callback) => {
  // if (!event.requestContext.authorizer) {
  // 	errorResponse('Authorization not configured', context.awsRequestId, callback);
  // 	return;
  // }

  let user = event.queryStringParameters.user;
  //user=user&linksPerPage=50&page=1

  try {
    let links = await getTagsForUser(user);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(links),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify(err),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

async function getTagsForUser(user) {
  let tableParams = {
    TableName: 'Barelinks',
    ExpressionAttributeValues: {
      ':userId': user
    },
    FilterExpression: 'userId = :userId'
  };

  try {
    let tic = new Date();
    let res = await ddb.scan(tableParams).promise();
    let toc = new Date();
    console.log('Duration: ' + (toc - tic));
    let linkList = res.Items;

    let tags = [];
    for (let link of linkList) {
      if (link.tags) {
        for (let tag of link.tags) {
          tags = increment(tags, tag);
        }
      }
    }
    let sortedTags = tags.sort((a, b) => b.count - a.count);
    return { success: true, tags: sortedTags };
  } catch (err) {
    return { success: false, error: err };
  }
}

function increment(tags, tag) {
  let output = [];
  let found = false;
  for (let el of tags) {
    if (el.name === tag.name && el.color === tag.color) {
      output.push({ ...tag, count: el.count + 1 });
      found = true;
    } else {
      output.push(el);
    }
  }
  if (!found) output.push({ ...tag, count: 1 });
  return output;
}
