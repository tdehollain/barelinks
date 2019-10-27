const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

exports.handler = async (event, context, callback) => {
  // if (!event.requestContext.authorizer) {
  // 	errorResponse('Authorization not configured', context.awsRequestId, callback);
  // 	return;
  // }

  console.log('Path params: ' + JSON.stringify(event.pathParameters));

  try {
    let user = event.queryStringParameters.user;
    let linksPerPage = event.queryStringParameters.linksPerPage;
    let page = event.queryStringParameters.page;
    let searchTerm = decodeURIComponent(event.queryStringParameters.searchterm);
    let links = await getLinksBySearchTerm(user, linksPerPage, page, searchTerm);
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

async function getLinksBySearchTerm(user, linksPerPage, page, searchTerm) {
  let tableParams = {
    TableName: 'Barelinks',
    ExpressionAttributeValues: {
      ':userId': user
    },
    FilterExpression: 'userId = :userId'
  };

  try {
    let res = await ddb.scan(tableParams).promise();
    let linksList = res.Items;
    let filteredLinksList = linksList.filter((el, i) => {
      let inTitle = el.title.indexOf(searchTerm) >= 0;
      let inURL = el.url.indexOf(searchTerm) >= 0;
      let inTags = false;
      if (el.tags) {
        for (let tag of el.tags) {
          if (tag.name.indexOf(searchTerm) >= 0) {
            inTags = true;
            break;
          }
        }
      }
      return inTitle || inURL || inTags;
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
