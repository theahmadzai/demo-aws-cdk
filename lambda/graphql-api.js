const resolvers = {
  hello: () => 'world',
  world: () => 'hello',
}

exports.handler = async (event) => {
  if (!Object.keys(resolvers).includes(event.info.fieldName)) {
    return null
  }

  return resolvers[event.info.fieldName]()
}
