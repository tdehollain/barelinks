const randomBytes = require('crypto').randomBytes;
const fetch = require('node-fetch');
const decode = require('unescape');
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

exports.handler = async (event, context, callback) => {
  // if (!event.requestContext.authorizer) {
  // 	errorResponse('Authorization not configured', context.awsRequestId, callback);
  // 	return;
  // }

  const requestBody = JSON.parse(event.body);
  const linkId = toUrlString(randomBytes(16));
  console.log(requestBody);

  try {
    let res = await putLink(linkId, requestBody.user, requestBody.url);
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

async function putLink(linkId, user, url) {
  let { success, title } = await getTitle(url);
  // console.log("title: " + title);
  if (!success) title = url;
  let newItem = {
    linkId: linkId,
    userId: user,
    url: url,
    title: title,
    date: new Date().toISOString()
  };

  let tableParams = {
    TableName: 'Barelinks',
    Item: newItem
  };

  try {
    let res = await ddb.put(tableParams).promise();
    return { success: true, res: newItem };
  } catch (err) {
    return { success: false, error: JSON.stringify(err) };
  }
}

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
