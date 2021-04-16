const cdk = require('@aws-cdk/core')
const appsync = require('@aws-cdk/aws-appsync')
const lambda = require('@aws-cdk/aws-lambda')
const apigateway = require('@aws-cdk/aws-apigateway')

class AwsCdkGraphqlStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props)

    const graphqlApi = new appsync.GraphqlApi(this, 'GraphqlApi', {
      name: 'graphql-api',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    })

    const helloLambda = new lambda.Function(this, 'HelloLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: new lambda.AssetCode('lambda'),
      handler: 'graphql-api.handler',
    })

    const helloDataSource = graphqlApi.addLambdaDataSource(
      'GraphqlEndPoint',
      helloLambda
    )

    const queryFields = ['hello', 'world']

    queryFields.forEach((fieldName) => {
      helloDataSource.createResolver({ typeName: 'Query', fieldName })
    })

    const mutationFields = ['changeHello']

    mutationFields.forEach((fieldName) => {
      helloDataSource.createResolver({ typeName: 'Mutation', fieldName })
    })

    new cdk.CfnOutput(this, 'GraphqlUrl', {
      value: graphqlApi.graphqlUrl,
    })

    new cdk.CfnOutput(this, 'GraphqlApiKey', {
      value: graphqlApi.apiKey || '',
    })
  }
}

module.exports = { AwsCdkGraphqlStack }
