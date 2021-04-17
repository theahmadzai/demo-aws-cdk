const { DynamoDB } = require('aws-sdk')
const documentClient = new DynamoDB.DocumentClient()

const resources = {
  earth: () => ({ message: 'Hello Earth' }),
  mars: () => ({ message: 'Hello Mars' }),
  messages: async (event) => {
    if (event.httpMethod === 'POST') {
      const { message } = event.body

      const record = {
        id: Math.random(),
        message,
      }

      await documentClient
        .put({
          TableName: process.env.MESSAGES_TABLE || null,
          Item: record,
        })
        .promise()

      return record
    } else if (event.httpMethod === 'DELETE') {
      const { id } = event.body

      await documentClient
        .delete({
          TableName: process.env.MESSAGES_TABLE || null,
          Key: { id },
        })
        .promise()

      return id
    } else if (event.httpMethod === 'PATCH') {
      const { id, message } = event.body

      await documentClient
        .update({
          TableName: process.env.MESSAGES_TABLE || null,
          Key: { id: id },
          UpdateExpression: 'set #message = :message',
          ExpressionAttributeNames: { '#message': 'message' },
          ExpressionAttributeValues: { ':message': message },
          ReturnValues: 'UPDATED_NEW',
        })
        .promise()

      return { id, message }
    }

    const data = await documentClient
      .scan({
        TableName: process.env.MESSAGES_TABLE || null,
      })
      .promise()

    return data.Items
  },
}

exports.handler = async (event) => {
  const resource = event.path.replace('/', '').trim()

  if (!Object.keys(resources).includes(resource)) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: `resource not found at ${resource}` }),
    }
  }

  const response = await resources[resource](event)

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  }
}
