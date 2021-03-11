const cdk = require('@aws-cdk/core')
const s3 = require('@aws-cdk/aws-s3')

class AwsCdkAppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props)

    new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })
  }
}

module.exports = { AwsCdkAppStack }
