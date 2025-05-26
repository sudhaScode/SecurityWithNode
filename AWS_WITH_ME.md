# AWS with Node Js 
The AWS SDK for JavaScript (v3) adopts a modular architecture, allowing developers to import only the specific AWS service clients they need. Each service client is available as a separate package under the `@aws-sdk` scope on npm.([Amazon Web Services, Inc.][1], [Amazon Web Services, Inc.][2])
## Setup
Get the `Access key ID`, `Secret Access key`, and region
Execute the `$ aws configure` which creates .aws/crendentials and .aws/config file or set env directly
- Access Key ID
- Secret Access Key
- Default region
- Output format (optional)
### 📦 Commonly Used `@aws-sdk` Modules for Node.js

Here are some of the frequently utilized modules:

* `@aws-sdk/client-s3` – Amazon Simple Storage Service (S3)
* `@aws-sdk/client-dynamodb` – Amazon DynamoDB
* `@aws-sdk/client-lambda` – AWS Lambda
* `@aws-sdk/client-sqs` – Amazon Simple Queue Service (SQS)
* `@aws-sdk/client-sns` – Amazon Simple Notification Service (SNS)
* `@aws-sdk/client-ec2` – Amazon Elastic Compute Cloud (EC2)
* `@aws-sdk/client-cloudwatch` – Amazon CloudWatch
* `@aws-sdk/client-apigateway` – Amazon API Gateway
* `@aws-sdk/client-iam` – AWS Identity and Access Management (IAM)
* `@aws-sdk/client-sts` – AWS Security Token Service (STS)
* `@aws-sdk/client-eventbridge` – Amazon EventBridge
* `@aws-sdk/client-kinesis` – Amazon Kinesis
* `@aws-sdk/client-cloudformation` – AWS CloudFormation
* `@aws-sdk/client-cognito-identity` – Amazon Cognito Identity
* `@aws-sdk/client-secrets-manager` – AWS Secrets Manager
* `@aws-sdk/client-ses` – Amazon Simple Email Service (SES)
* `@aws-sdk/client-elb` – Elastic Load Balancing
* `@aws-sdk/client-rds` – Amazon Relational Database Service (RDS)
* `@aws-sdk/client-cloudfront` – Amazon CloudFront
* `@aws-sdk/client-efs` – Amazon Elastic File System (EFS)
* `@aws-sdk/client-eks` – Amazon Elastic Kubernetes Service (EKS)
* `@aws-sdk/client-glue` – AWS Glue
* `@aws-sdk/client-redshift` – Amazon Redshift
* `@aws-sdk/client-textract` – Amazon Textract
* `@aws-sdk/client-transcribe` – Amazon Transcribe
* `@aws-sdk/client-translate` – Amazon Translate
* `@aws-sdk/client-rekognition` – Amazon Rekognition
* `@aws-sdk/client-sagemaker` – Amazon SageMaker
* `@aws-sdk/client-athena` – Amazon Athena
* `@aws-sdk/client-cloudtrail` – AWS CloudTrail
* `@aws-sdk/client-codebuild` – AWS CodeBuild
* `@aws-sdk/client-codepipeline` – AWS CodePipeline
* `@aws-sdk/client-elasticache` – Amazon ElastiCache
* `@aws-sdk/client-logs` – Amazon CloudWatch Logs
* `@aws-sdk/client-kms` – AWS Key Management Service (KMS)
* `@aws-sdk/client-route53` – Amazon Route 53
* `@aws-sdk/client-ssm` – AWS Systems Manager
* `@aws-sdk/client-xray` – AWS X-Ray([AWS Documentation][3], [AWS Documentation][4])

Each of these packages provides a client tailored to interact with its respective AWS service, enabling fine-grained control over your application's dependencies and potentially reducing bundle sizes.

For a comprehensive list of available modules, you can visit the [AWS SDK for JavaScript v3 documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html) or search the [npm registry](https://www.npmjs.com/search?q=%40aws-sdk) for packages under the `@aws-sdk` scope.

If you need assistance with a specific service client or have questions about integrating these modules into your Node.js application, feel free to ask!

[1]: https://aws.amazon.com/blogs/developer/modular-packages-in-aws-sdk-for-javascript/?utm_source=chatgpt.com "Modular packages in AWS SDK for JavaScript"
[2]: https://aws.amazon.com/sdk-for-javascript/?utm_source=chatgpt.com "AWS SDK for JavaScript"
[3]: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-js-considerations.html?utm_source=chatgpt.com "Node.js considerations - AWS SDK for JavaScript"
[4]: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS.html?utm_source=chatgpt.com "Module: AWS — AWS SDK for JavaScript"

## ✅ Use Case: Daily Database Backup to S3
🧩 Problem
You have a Node.js application using a MongoDB/PostgreSQL database. To ensure data durability, you want to automatically back up the database every day at midnight and store the dump in Amazon S3.

🧰 Solution Architecture
  - AWS Lambda (Node.js): Executes the backup logic.
  - Amazon S3: Stores the backup files.
  - Amazon CloudWatch Events (EventBridge): Triggers the Lambda function daily.
  - IAM Role: Grants Lambda permission to write to S3.
🛠️ Steps Involved
1. Lambda Function in Node.js
   
``` javaScript
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const s3 = new S3Client({ region: 'us-east-1' });

exports.handler = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `/tmp/db-backup-${timestamp}.gz`;

  return new Promise((resolve, reject) => {
    // Example: backing up a MongoDB database
    const cmd = `mongodump --archive=${filename} --gzip --uri="mongodb+srv://user:pass@cluster.mongodb.net/dbname"`;
    
    exec(cmd, async (error) => {
      if (error) {
        return reject(`Backup failed: ${error.message}`);
      }

      const fileContent = fs.readFileSync(filename);
      const uploadParams = {
        Bucket: 'my-db-backups',
        Key: `backups/db-backup-${timestamp}.gz`,
        Body: fileContent,
      };

      try {
        await s3.send(new PutObjectCommand(uploadParams));
        resolve(`Backup successful: ${uploadParams.Key}`);
      } catch (err) {
        reject(`S3 upload failed: ${err.message}`);
      }
    });
  });
};

```
2. CloudWatch Events (EventBridge Rule)
  Create a rule to trigger Lambda daily at 00:00 UTC:
   ``` bash
   cron(0 0 * * ? *)3. IAM Role for Lambda
   ```
3. IAM Role for Lambda
  Attach the following permissions:
``` bash
  {
    "Effect": "Allow",
    "Action": ["s3:PutObject"],
    "Resource": "arn:aws:s3:::my-db-backups/*"
  }
```

✅ Benefits
  - Automated and serverless – no cron servers or EC2s
  - Backups stored securely in S3
  - Scalable and reliable


## 🎯 Use Case: Setting IAM rules and creating Lambda fucntion
Here's a practical use case where you use @aws-sdk/client-iam to create and attach an IAM role with execution permissions to a Lambda function created via @aws-sdk/client-lambda.
You want to programmatically create a Lambda function in Node.js that has permissions to access CloudWatch Logs and S3, and for that you:

Create an IAM role with a trust policy for Lambda.
Attach a managed policy (e.g., AWSLambdaBasicExecutionRole).

Use this role to create a Lambda function.

📦 Required Packages
``` bash
npm install @aws-sdk/client-iam @aws-sdk/client-lambda @aws-sdk/client-s3
```
✅ Step-by-Step Code
  ``` js
// setup.js
import {
  IAMClient,
  CreateRoleCommand,
  AttachRolePolicyCommand,
  GetRoleCommand,
} from '@aws-sdk/client-iam';

import {
  LambdaClient,
  CreateFunctionCommand,
} from '@aws-sdk/client-lambda';

import fs from 'fs';
import path from 'path';

// Initialize clients
const iamClient = new IAMClient({ region: 'us-east-1' });
const lambdaClient = new LambdaClient({ region: 'us-east-1' });

// 1. Create IAM Role
async function createLambdaExecutionRole() {
  const roleName = 'LambdaBasicExecutionRole';

  const trustPolicy = {
    Version: '2012-10-17',
    Statement: [{
      Effect: 'Allow',
      Principal: { Service: 'lambda.amazonaws.com' },
      Action: 'sts:AssumeRole'
    }]
  };

  try {
    await iamClient.send(new CreateRoleCommand({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(trustPolicy),
    }));

    // Attach AWS managed Lambda policy
    await iamClient.send(new AttachRolePolicyCommand({
      RoleName: roleName,
      PolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
    }));

    console.log(`✅ Role '${roleName}' created and policy attached.`);
  } catch (error) {
    console.error('❌ Error creating IAM role:', error);
  }

  // Return the role ARN
  const { Role } = await iamClient.send(new GetRoleCommand({ RoleName: roleName }));
  return Role.Arn;
}

// 2. Create Lambda Function
async function createLambdaWithRole(roleArn) {
  const functionName = 'MyNodeLambda';
  const lambdaZipPath = path.resolve('./my-lambda.zip'); // zip containing index.js with handler

  const codeBuffer = fs.readFileSync(lambdaZipPath);

  const params = {
    Code: { ZipFile: codeBuffer },
    FunctionName: functionName,
    Handler: 'index.handler',
    Role: roleArn,
    Runtime: 'nodejs18.x',
    Description: 'Lambda function with IAM role created via SDK',
    Timeout: 10,
    MemorySize: 128,
    Publish: true,
  };

  try {
    const result = await lambdaClient.send(new CreateFunctionCommand(params));
    console.log('✅ Lambda created:', result.FunctionArn);
  } catch (error) {
    console.error('❌ Error creating Lambda:', error);
  }
}

// Run the setup
(async () => {
  const roleArn = await createLambdaExecutionRole();
  await createLambdaWithRole(roleArn);
})();

  ```
🧪 Lambda Code Example (index.js)
``` js
exports.handler = async (event) => {
  console.log("Lambda triggered!");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' }),
  };
};

```
Zip this file into my-lambda.zip before running the main script.

🔐 IAM Concepts Covered
- Trust Policy: Grants Lambda the right to assume the role.
- Managed Policy Attachment: Grants log write access (AWSLambdaBasicExecutionRole).
- Role ARN: Required when creating the Lambda function.


