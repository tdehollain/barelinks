const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

const TableName = process.env.BARELINKS_TABLE;

exports.handler = async (event, context, callback) => {
  // if (!event.requestContext.authorizer) {
  // 	errorResponse('Authorization not configured', context.awsRequestId, callback);
  // 	return;
  // }

  let user = event.queryStringParameters.user;
  let linksPerPage = event.queryStringParameters.linksPerPage;
  let page = event.queryStringParameters.page;
  let tagName = decodeURIComponent(event.queryStringParameters.tagName);
  let tagColor = '#' + event.queryStringParameters.tagColor;
  //user=user&tagName=hello

  try {
    let links = await getLinksByTag(user, linksPerPage, page, tagName, tagColor);
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

async function getLinksByTag(user, linksPerPage, page, tagName, tagColor) {
  let tableParams = {
    TableName,
    ExpressionAttributeValues: {
      ':userId': user
    },
    FilterExpression: 'userId = :userId'
  };

  try {
    let res = await ddb.scan(tableParams).promise();
    let linksList = res.Items;
    let filteredLinksList = linksList.filter((el, i) => {
      return containsTag(el, tagName, tagColor);
    });
    let totalCount = filteredLinksList.length;
    console.log('totalCount: ' + totalCount);
    // Sort list by date
    let sortedList = filteredLinksList.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    // keep only the right page
    let pagedList = sortedList.slice((page - 1) * linksPerPage, page * linksPerPage);
    return { success: true, list: pagedList, totalCount };
  } catch (err) {
    return { success: false, error: err };
  }
}

function containsTag(link, tagName, tagColor) {
  if (!link.tags) return false;
  let filteredTagsList = link.tags.filter((el, i) => {
    if (tagColor === 'undefined') {
      return el.name === tagName;
    }
    return el.name === tagName && el.color === tagColor;
  });
  return filteredTagsList.length;
}
