exports.handler = async (event) => {
  console.log('Request:', JSON.stringify(event, null, 2))

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `You have hit: ${event.path}`,
  }
}
