const resolvers = {
  hello: () => 'world',
  world: () => 'hello',
  changeHello: ({ world }) => `Hello changed to ${world}`,
}

exports.handler = async (event) => {
  if (!Object.keys(resolvers).includes(event.info.fieldName)) {
    return null
  }

  return resolvers[event.info.fieldName](event?.arguments ?? undefined)
}
