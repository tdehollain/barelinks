const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

exports.handler = async (event, context, callback) => {
  // if (!event.requestContext.authorizer) {
  // 	errorResponse('Authorization not configured', context.awsRequestId, callback);
  // 	return;
  // }

  const requestBody = JSON.parse(event.body);

  try {
    let res = await updateLink(requestBody.linkId, requestBody.user, requestBody.action, requestBody.tagName, requestBody.tagColor);
    return callback(null, {
      statusCode: 201,
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

async function updateLink(linkId, user, action, tagName, tagColor) {
  // 1. Get link object
  let tableParamsGet = {
    TableName: 'Barelinks',
    Key: {
      userId: user,
      linkId: linkId
    }
  };

  let linkItem;
  try {
    let linkItemRaw = await ddb.get(tableParamsGet).promise();
    linkItem = linkItemRaw.Item;
  } catch (err) {
    return { success: false, error: JSON.stringify(err) };
  }

  // 2. update tags property
  let currentTags = linkItem.tags || [];
  let newTags = [];
  console.log('currentTags: ' + JSON.stringify(currentTags));
  console.log('newTags: ' + JSON.stringify(newTags));
  if (action === 'addTag') {
    newTags = currentTags;
    newTags.push({ name: tagName, color: tagColor });
  } else if (action === 'removeTag') {
    for (let tag of currentTags) {
      console.log('tag: ' + JSON.stringify(tag));
      if (tag.name !== tagName || tag.color !== tagColor) newTags.push(tag);
    }
  }
  console.log('newTags: ' + JSON.stringify(newTags));

  // 3. replace item with updated one
  let tableParamsUpdate = {
    TableName: 'Barelinks',
    Key: {
      userId: user,
      linkId: linkId
    },
    ExpressionAttributeValues: {
      ':tags': newTags
    },
    UpdateExpression: 'set tags = :tags',
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    let newLinkItem = await ddb.update(tableParamsUpdate).promise();
    return { success: true, link: newLinkItem.Item };
  } catch (err) {
    return { success: false, error: JSON.stringify(err) };
  }
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId
    }),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}

function toUrlString(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
