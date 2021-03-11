#!/usr/bin/env node

const cdk = require('@aws-cdk/core')
const { AwsCdkAppStack } = require('../lib/aws-cdk-app-stack')

const app = new cdk.App()
new AwsCdkAppStack(app, 'AwsCdkAppStack', {
  env: {
    account: '674122170248',
    region: 'us-east-1',
  },
})
