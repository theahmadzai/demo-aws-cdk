#!/usr/bin/env node

const cdk = require('@aws-cdk/core')
const { AwsCdkAppStack } = require('../lib/aws-cdk-app-stack')
const { AwsCdkGraphqlStack } = require('../lib/aws-cdk-graphql-stack')

const app = new cdk.App()
new AwsCdkAppStack(app, 'AwsCdkAppStack')
new AwsCdkGraphqlStack(app, 'AwsCdkGraphqlStack')
