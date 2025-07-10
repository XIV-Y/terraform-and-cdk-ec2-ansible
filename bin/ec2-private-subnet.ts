#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Ec2PrivateSubnetCdkStack } from '../lib/ec2-private-subnet-cdk-stack';

const app = new cdk.App();

new Ec2PrivateSubnetCdkStack(app, 'Ec2PrivateSubnetCdkStack', {});
