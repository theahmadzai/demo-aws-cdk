const cdk = require('@aws-cdk/core')
const s3 = require('@aws-cdk/aws-s3')
const s3Deploy = require('@aws-cdk/aws-s3-deployment')
const cloudfront = require('@aws-cdk/aws-cloudfront')
const cloudfrontOrigins = require('@aws-cdk/aws-cloudfront-origins')
const lambda = require('@aws-cdk/aws-lambda')
const apigateway = require('@aws-cdk/aws-apigateway')

class AwsCdkAppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props)

    new s3.Bucket(this, 'StorageBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
    })

    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    })

    // const distribution = new cloudfront.Distribution(this, 'Distribution', {
    //   defaultBehavior: {
    //     origin: new cloudfrontOrigins.S3Origin(websiteBucket),
    //   },
    //   defaultRootObject: "index.html",
    // })

    // new cdk.CfnOutput(this, 'DistributionDomainName', {
    //   value: distribution.domainName,
    // })

    new s3Deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3Deploy.Source.asset('./src')],
      destinationBucket: websiteBucket,
      // distribution,
      // distributionPaths: ["/*"],
    })

    const helloLambda = new lambda.Function(this, 'HelloLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler',
    })

    const helloApi = new apigateway.LambdaRestApi(this, 'HelloApi', {
      handler: helloLambda,
      proxy: false,
    })

    const world = helloApi.root.addResource('world')
    const mars = helloApi.root.addResource('mars')

    world.addMethod('GET')
    mars.addMethod('GET')
  }
}

module.exports = { AwsCdkAppStack }
