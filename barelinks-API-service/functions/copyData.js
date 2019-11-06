const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

const newTableName = 'barelinks-production';
const oldTableName = 'barelinks-production';

exports.handler = async () => {
  // get links
  let tableParams = {
    TableName: oldTableName,
    ExpressionAttributeValues: {
      ':userId': 'Thibaut'
    },
    FilterExpression: 'userId = :userId'
  };

  let res = await ddb.scan(tableParams).promise();
  let items = res.Items;
  let totalCount = items.length;

  let itemsSaved = 0;
  for (let item of items) {
    const params = {
      TableName: newTableName,
      Item: { ...item, userId: 'thibaut.dehollain@gmail.com' }
    };
    await ddb.put(params).promise();
    itemsSaved++;
  }

  return { newTableName, totalCount, itemsSaved };
};
