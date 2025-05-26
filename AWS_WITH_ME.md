# AWS with Node Js 
The AWS SDK for JavaScript (v3) adopts a modular architecture, allowing developers to import only the specific AWS service clients they need. Each service client is available as a separate package under the `@aws-sdk` scope on npm.([Amazon Web Services, Inc.][1], [Amazon Web Services, Inc.][2])
## Setup
Get the `Access key ID`, `Secret Access key`, and region
Execute the `$ aws configure` which creates .aws/crendentials and .aws/config file or set env directly
seeting environment variables:
```bash
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_SESSION_TOKEN=your-session-token  # (optional, used for temporary credentials)

```
- Access Key ID
- Secret Access Key
- Default region
- Output format (optional)
  OR <br>
const iamClient = new IAMClient({ region: 'us-east-1' }); from AWS SDK for JavaScript (v3, @aws-sdk/*) determines who you are (credentials) and what you can access (permissions) using a well-defined default credential provider chain.

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

## ✅ Use Case -AWS EKS
Goal: Use @aws-sdk/client-eks to interact with an EKS cluster that runs a Dockerized version of interviewcraft.ai pulled from ECR.

📦 Prerequisites
- Dockerized app image (e.g. 123456789012.dkr.ecr.us-east-1.amazonaws.com/interviewcraft:latest)
- ECR repository and image already pushed
- EKS cluster created (e.g. interviewcraft-cluster)
- kubectl configured locally
⚙️ Step-by-Step Setup with `Node.js + @aws-sdk/client-eks`
1. Install the SDK
``` bash
npm install @aws-sdk/client-eks @aws-sdk/client-ecr @aws-sdk/credential-provider-node

```
2. Authenticate EKS Cluster (Generate Kubeconfig)
``` js
import { EKSClient, DescribeClusterCommand } from "@aws-sdk/client-eks";
import { fromIni } from "@aws-sdk/credential-provider-node";
import { execSync } from "child_process";

const region = "us-east-1";
const clusterName = "interviewcraft-cluster";

const client = new EKSClient({ region, credentials: fromIni() });

async function updateKubeconfig() {
  const { cluster } = await client.send(new DescribeClusterCommand({ name: clusterName }));

  const endpoint = cluster.endpoint;
  const ca = cluster.certificateAuthority.data;

  // Use aws CLI via exec to update kubeconfig (best practice)
  execSync(`aws eks update-kubeconfig --name ${clusterName} --region ${region}`, { stdio: "inherit" });

  console.log("✅ kubeconfig updated. Ready to use kubectl.");
}

updateKubeconfig();

```
3. Deploy InterviewCraft App Using kubectl
Create a deployment.yaml file for Kubernetes:
``` yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: interviewcraft-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: interviewcraft
  template:
    metadata:
      labels:
        app: interviewcraft
    spec:
      containers:
      - name: interviewcraft
        image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/interviewcraft:latest
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: interviewcraft-service
spec:
  type: LoadBalancer
  selector:
    app: interviewcraft
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000

```
Apply it using:
``` bash
kubectl apply -f deployment.yaml
```
4. Allow EKS to Pull from ECR (IAM Role + Policy)
EKS nodes use an IAM role. Attach this policy to allow ECR image pull:
``` json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}

```
You may also need to create an ECR login secret in your cluster:
``` bash
aws ecr get-login-password --region us-east-1 | \
kubectl create secret docker-registry ecr-creds \
--docker-server=123456789012.dkr.ecr.us-east-1.amazonaws.com \
--docker-username=AWS \
--docker-password="$(cat -)" \
--namespace=default
```
Add this secret to your deployment.yaml under spec.template.spec.imagePullSecrets.
✅ Final Outcome
- Your interviewcraft.ai app is served from a scalable, highly available Kubernetes deployment.
- It's deployed on EKS, pulling its image from ECR.
- You can scale it, monitor it, and expose it to the public using a LoadBalancer service.
## CI/CD pipeline 
To deploy to AWS Fargate as a final step in your CI/CD pipeline after running `npm run lint`, `npm run test`, and `npm run build`, you'll need to:

### 1. **Build and push a Docker image**

First, package your app as a Docker image and push it to a container registry like Amazon ECR.

### 2. **Update the ECS Fargate service**

After pushing the image, update the ECS service to use the new image.

### Here's an example using a GitHub Actions workflow:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Lint
      run: npm run lint

    - name: Test
      run: npm run test

    - name: Build
      run: npm run build

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v3
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2

    - name: Build, tag, and push image to Amazon ECR
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: my-app
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

    - name: Deploy to Amazon ECS
      uses: aws-actions/amazon-ecs-deploy-task-definition@v1
      with:
        task-definition: ecs-task-def.json
        service: my-fargate-service
        cluster: my-cluster
        image: ${{ steps.login-ecr.outputs.registry }}/my-app:${{ github.sha }}
        wait-for-service-stability: true
```

### Notes:

* Replace `my-app`, `my-fargate-service`, and `my-cluster` with your real values.
* You need a valid ECS task definition file (`ecs-task-def.json`) in your repo or generate it dynamically.
* Ensure AWS credentials are stored in GitHub Secrets.

Would you like help generating the `ecs-task-def.json` file or using another CI/CD tool like GitLab CI, Bitbucket Pipelines, or AWS CodePipeline?


# AWS with Python
In Python, AWS services are typically accessed using the boto3 library, which is the official AWS SDK for Python. It provides a high-level and low-level interface for all AWS services.
✅ boto3
- Official AWS SDK for Python
- Supports all AWS services
- Interacts via clients and resources
- Uses botocore under the hood for low-level service definitions
  ``` bash
  pip install boto3
  ```
🔐 Credentials Configuration
1. Environment Variables
``` ini
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```
2. ~/.aws/credentials file
```ini
[default]
aws_access_key_id = YOUR_KEY
aws_secret_access_key = YOUR_SECRET
```
3. IAM Role (if running on EC2, Lambda, etc.)
🔧 Commonly Used Services via boto3
  | AWS Service             | Client Example                   | Notes                                      |
| ----------------------- | -------------------------------- | ------------------------------------------ |
| S3 (Storage)            | `boto3.client('s3')`             | Upload, download, list buckets             |
| EC2 (Compute)           | `boto3.client('ec2')`            | Launch, stop, describe instances           |
| Lambda                  | `boto3.client('lambda')`         | Invoke, deploy functions                   |
| IAM                     | `boto3.client('iam')`            | Users, roles, policies                     |
| CloudWatch              | `boto3.client('cloudwatch')`     | Logs, alarms, metrics                      |
| DynamoDB                | `boto3.resource('dynamodb')`     | Table-based NoSQL DB                       |
| ECR (Docker images)     | `boto3.client('ecr')`            | Push, pull, manage images                  |
| ECS (Container Service) | `boto3.client('ecs')`            | Fargate, task definitions, service updates |
| EKS                     | `boto3.client('eks')`            | Kubernetes clusters                        |
| CloudFormation          | `boto3.client('cloudformation')` | Stack automation                           |

📦 Structure & Usage Patterns
1. Client Interface (Low-level API)
```python

import boto3

s3_client = boto3.client('s3')
response = s3_client.list_buckets()
print(response)
```
2. Resource Interface (High-level abstraction for some services)
```python

import boto3
s3 = boto3.resource('s3')
bucket = s3.Bucket('my-bucket')
for obj in bucket.objects.all():
    print(obj.key)
```
