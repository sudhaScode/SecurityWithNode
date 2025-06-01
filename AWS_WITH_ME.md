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

# Lambda Functions
AWS Lambda is an event-driven, serverless compute service that lets you run code without provisioning or managing servers. Explore deployment and testing considerations,monitoring, and troubleshooting Lambda functions.
Some benefits of using Lambda include the following:
- You can run code without provisioning or maintaining servers.
- It initiates functions for you in response to events.
- It scales automatically.
- It provides built-in code monitoring and logging via Amazon CloudWatch.

**Event-driven architectures**

An event-driven architecture uses events to initiate actions and communication between decoupled services. An event is a change in state, a user request, or an update, like an item being placed in a shopping cart in an e-commerce website. When an event occurs, the information is published for other services to consume it. In event-driven architectures, events are the primary mechanism for sharing information across services. These events are observable, such as a new message in a log file, rather than directed, such as a command to specifically do something.
<br>
**Producers, routers, consumers**

AWS Lambda is an example of an event-driven architecture. Most AWS services generate events and act as an event source for Lambda. Lambda runs custom code (functions) in response to events. Lambda functions are designed to process these events and, once invoked, may initiate other actions or subsequent events.

![image](https://github.com/user-attachments/assets/766549b7-7cb1-4f7a-b2a9-d83319dea79a)

**What is a Lambda function?**

The code you run on AWS Lambda is called a Lambda function. Think of a function as a small, self-contained application. After you create your Lambda function, it is ready to run as soon as it is initiated. Each function includes your code as well as some associated configuration information, including the function name and resource requirements. Lambda functions are stateless, with no affinity to the underlying infrastructure. Lambda can rapidly launch as many copies of the function as needed to scale to the rate of incoming events.

**Actions you can take with AWS Lambda:**
 - Access Permissions
 - Triggering Events - Specify which events or event sources can initiate the function
 - Write code - with dependencies or libraries necessary to your code
 - Configure Execution Parameters - such as memory , timeout, and concurrency
Serverless provides speed and innovation in your business applications

```
With AWS Lambda, you can run code without provisioning or managing servers. Lambda initiates events on your behalf, scales automatically, and provides built-in monitoring and logging. You can write code in your preferred language. You do configure the memory for your function, but not CPU. You don't work with the OS. AWS provides the operating environment at runtime.
```
## AWS Lambda works using event sources and triggers:
Understand event driven architectures like AWS Lambda
**Invocation models for running Lambda functions**

Event sources can invoke a Lambda function in three general patterns. These patterns are called invocation models. Each invocation model is unique and addresses a different application and developer needs. The invocation model you use for your Lambda function often depends on the event source you are using. It's important to understand how each invocation model initializes functions and handles errors and retries.
1. **Synchronous invocation**
   When you invoke a function synchronously, Lambda runs the function and waits for a response. When the function completes, Lambda returns the response from the 
   function's code with additional data, such as the version of the function that was invoked. Synchronous events expect an immediate response from the function 
   invocation.
   With this model, there are no built-in retries. You must manage your retry strategy within your application code.

   **Synchronous AWS Service**
   The following AWS services invoke Lambda synchronously:
      - Amazon API Gateway
      - Amazon Cognito
      - AWS CloudFormation
      - Amazon Alexa
      - Amazon Lex
      - Amazon CloudFront
   2. **Asychronous invocation**
      When you invoke a function asynchronously, events are queued and the requestor doesn't wait for the function to complete. This model is appropriate when the 
      client doesn't need an immediate response.
      With the asynchronous model, you can make use of destinations. Use destinations to send records of asynchronous invocations to other services. 
       **Asynchronous AWS Service Integration**
      The following AWS services invoke Lambda asynchronously: 
        - Amazon SNS 
        - Amazon S3
        - Amazon EventBridge
    **Destination**
    The following diagram shows a function that is processing asynchronous invocations. When the function returns a success response or exits without producing an 
    error, Lambda sends a record of the invocation to an EventBridge event bus. When an event fails all processing attempts, Lambda sends an invocation record to 
    an Amazon Simple Queue Service (Amazon SQS) queue.
![image](https://github.com/user-attachments/assets/bc63047e-7c69-431d-80f3-f398eec2e8f3)
3. **Polling invocation**
   **Polling**
   This invocation model is designed to integrate with AWS streaming and queuing based services with no code or server management. Lambda will poll (or watch) 
   these services, retrieve any matching events, and invoke your functions. This invocation model supports the following services:
      - Amazon Kinesis
      - Amazon SQS
      - Amazon DynamoDB Streams
   With this type of integration, AWS will manage the poller on your behalf and perform synchronous invocations of your function.
   **Event Sourcce Maping**
  The configuration of services as event triggers is known as event source mapping. This process occurs when you configure event sources to launch your Lambda 
  functions and then grant theses sources IAM permissions to access the Lambda function.
  Lambda reads events from the following services:
    - Amazon DynamoDB
    - Amazon Kinesis
    - Amazon MQ
    - Amazon Managed Streaming for Apache Kafka (MSK)
    - self-managed Apache Kafka
    - Amazon SQS
4. **Invocation model error behavior**
   When deciding how to build your functions, consider how each invocation method handles errors. The following chart provides a quick outline of the error handling behavior of each invocation model.
![image](https://github.com/user-attachments/assets/893392b2-c103-4777-9f3b-d52dc227cf7f)
<br>
**Lambda execution environment**

Lambda invokes your function in an execution environment, which is a secure and isolated environment. The execution environment manages the resources required to run your function. The execution environment also provides lifecycle support for the function's runtime and any external extensions associated with your function. 
**Execution environment lifecycle**
![image](https://github.com/user-attachments/assets/f1efd3a4-14f5-4ba0-990b-e1517d7174d7)
When you create your Lambda function, you specify configuration information, such as the amount of available memory and the maximum invocation time allowed for your function. Lambda uses this information to set up the execution environment.

The function's runtime and each external extension are processes that run within the execution environment. Permissions, resources, credentials, and environment variables are shared between the function and the extensions.
  1. **init phase**
  In this phase, Lambda creates or unfreezes an execution environment with the configured resources, downloads the code for the function and all layers, initializes any extensions, initializes the runtime, and then runs the function’s initialization code (the code outside the main handler). 
  
  The Init phase happens either during the first invocation, or before function invocations if you have enabled provisioned concurrency.
  
  The Init phase is split into three sub-phases: 
  
  - Extension init - starts all extensions
  - Runtime init - bootstraps the runtime
  - Function init - runs the function's static code
  These sub-phases ensure that all extensions and the runtime complete their setup tasks before the function code runs.
  
  2. **Invoke Phase**
   Lambda invokes the function handler. After the function runs to completion, Lambda prepares to handle another function invocation.
  3. **Shutdown Phase**
     If the Lambda function does not receive any invocations for a period of time, this phase initiates. In the Shutdown phase, Lambda shuts down the runtime, 
     alerts the extensions to let them stop cleanly, and then removes the environment. Lambda sends a shutdown event to each extension, which tells the extension 
     that the environment is about to be shut down.

5. **Performance optimization**
   Serverless applications can be extremely performant, thanks to the ease of parallelization and concurrency. While the Lambda service manages scaling automatically, you can optimize the individual Lambda functions used in your application to reduce latency and increase throughput.
6. **Cold and warm starts**
A cold start occurs when a new execution environment is required to run a Lambda function. When the Lambda service receives a request to run a function, the service first prepares an execution environment. During this step, the service downloads the code for the function, then creates the execution environment with the specified memory, runtime, and configuration. Once complete, Lambda runs any initialization code outside of the event handler before finally running the handler code. 

In a warm start, the Lambda service retains the environment instead of destroying it immediately. This allows the function to run again within the same execution environment. This saves time by not needing to initialize the environment.  
![image](https://github.com/user-attachments/assets/d12fb74c-924d-4e15-871f-4970089d1e52)

**Best practice: Minimize cold start times**

When you invoke a Lambda function, the invocation is routed to an execution environment to process the request. If the environment is not already initialized, the start-up time of the environment adds to latency. If a function has not been used for some time, if more concurrent invocations are required, or if you update a function, new environments are created.  Creation of these environments can introduce latency for the invocations that are routed to a new environment. This latency is implied when using the term cold start. For most applications, this additional latency is not a problem. However, for some synchronous models, this latency can inhibit optimal performance. It is critical to understand latency requirements and try to optimize your function for peak performance. 

After optimizing your function, another way to minimize cold starts is to use provisioned concurrency. Provisioned concurrency is a Lambda feature that prepares concurrent execution environments before invocations.
**Best practice: Write functions to take advantage of warm starts**
  1. Store and reference dependencies locally.
  2. Limit re-initialization of variables.
  3. Add code to check for and reuse existing connections.
  4. Use tmp space as transient cache.
  5. Check that background processes have completed.
## AWS Lambda Function Permissions
With Lambda functions, there are two sides that define the necessary scope of permissions – permission to invoke the function, and permission of the Lambda function itself to act upon other services. Because Lambda is fully integrated with AWS Identity and Access Management (IAM), you can control the exact actions of each side of the Lambda function.
![image](https://github.com/user-attachments/assets/55ad90ca-9186-48b1-b062-382617790cca)

Permissions to invoke the function are controlled using an IAM resource-based policy. An IAM execution role defines the permissions that control what the function is allowed to do when interacting with other AWS services. Look at the full interaction of these two permission types and then explore each one in further detail.

![image](https://github.com/user-attachments/assets/9c96802b-3292-495d-8a18-e0b5ddfc1a95)
Resource policies grant permissions to invoke the function, whereas the execution role strictly controls what the function can to do within the other AWS service.
**Execution role**

The execution role gives your function permissions to interact with other services. You provide this role when you create a function, and Lambda assumes the role when your function is invoked. The policy for this role defines the actions the role is allowed to take — for example, writing to a DynamoDB table. The role must include a trust policy that allows Lambda to “AssumeRole” so that it can take that action for another service. You can write the role or use the managed roles (with predefined permissions) provided by Lambda to simplify the process of creating an execution role. You can add or remove permissions from a function's execution role at any time, or configure your function to use a different role. 

Remember to use the principle of least privilege when creating IAM policies and roles. Always start with the most restrictive set of permissions and only grant further permissions as required for the function to run. Using the principle of least privilege ensures security in depth and eliminates the need to remember to 'go back and fix it' once the function is in production.

![image](https://github.com/user-attachments/assets/3ad8bbdb-9eba-4131-9e98-61ece819f2ec)
You can also use (opens in a new tab)IAM Access Analyzer to help identify the required permissions for the IAM execution role

1. **IAM Policy**
   This IAM policy allows the function to perform the "Action": "dynamodb:PutItem" action against a DynamoDB table called "test" in the us-west-2 region.

![image](https://github.com/user-attachments/assets/43c17630-62df-4252-9a4d-6b9e717b2f3b)
2. **Trust Policy**
A trust policy defines what actions your role can assume. The trust policy allows Lambda to use the role's permissions by giving the service principal lambda.amazonaws.com permission to call the AWS Security Token Service (AWS STS) AssumeRole action.

This example illustrates that the principal "Service":"lambda.amazonaws.com" can take the "Action":"sts:AssumeRole" allowing Lambda to assume the role and invoke the function on your behalf.

![image](https://github.com/user-attachments/assets/b182bd77-ce64-4db3-86a4-15837ceedca1)
![AWS Rule](https://docs.aws.amazon.com/lambda/latest/dg/lambda-permissions.html)
https://docs.aws.amazon.com/lambda/latest/dg/lambda-permissions.html
https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html
https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html
https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html

**Rule Based Policy**
A resource policy (also called a function policy) tells the Lambda service which principals have permission to invoke the Lambda function. An AWS principal may be a user, role, another AWS service, or another AWS account.

![image](https://github.com/user-attachments/assets/5aadf296-64bd-4976-b95c-3e180f805ad0)

**Rule comparsion**
1. Lambda resource-based (function) policy

- Associated with a "push" event source such as Amazon API Gateway
- Created when you add a trigger to a Lambda function
- Allows the event source to take the lambda:InvokeFunction action
2. IAM execution role
- Role selected or created when you create a Lambda function
- IAM policy includes actions you can take with the resource
- Trust policy that allows Lambda to AssumeRole
- Creator must have permission for iam:PassRole
## Authoring AWS Lambda Functions
**Start with the handler method**
The Lambda function handler is the method in your function code that processes events. When your function is invoked, Lambda runs the handler method. When the handler exits or returns a response, it becomes available to handle another event. The handler method takes two objects – the event object and the context object. 
1. **Event Object**
- The event object is required.
- When your Lambda function is invoked in one of the supported languages, one of the parameters provided to your handler function is an event object. 
- The event object differs in structure and contents, depending on which event source created it. 
- The contents of the event parameter include all of the data and metadata your Lambda function needs to drive its logic.
      - For example, an event created by Amazon API Gateway will contain details related to the HTTPS request that was made by the API client (for example, path, 
        query string, request body). An event created by Amazon S3 when a new object is created will include details about the bucket and the new object.
2. **Design best practices**
  When designing and writing Lambda functions, regardless of the runtime you’re using, it is best practice to separate the business logic (the part of the code the defines the real-world business need) from the handler method. This makes your code more portable and you can target unit-tests at the code without worrying about the configuration of the function.
  It is also a best practice to make your functions modular. For example, instead of having one function that does compression, thumb-nailing, and indexing, consider having three different functions that each serve a single purpose. 

Because your functions only exist when there is work to be done, it is particularly important for serverless applications to treat each function as stateless. That is, no information about state should be saved within the context of the function itself.   

- **Separate business logic**
   Separate your core business logic from the handler event.This makes your code more portable and you can target unit-tests on your code without worrying about 
   the configuration of the function.
- **Write modular fucntions**
  Module functions will reduce the amount of time that it takes for your deployment package to be downloaded and unpacked before invocation. Instead of having one 
  function that does compression, thumb-nailing, and indexing, consider having three different functions that each serve a single purpose.
- **Treact functions as stateless**
  No information about state should be saved within the context of the function itself.
  Because your functions only exist when there is work to be done, it is particularly important for serverless applications to treat each function as stateless. 
  Consider one of the following options for storing state data:
    - Amazon DynamoDB is serverless and scales horizontally to handle your Lambda invocations. It also has single-millisecond latency, which makes it a great choice for storing state information. 
   - Amazon ElastiCache may be less expensive than DynamoDB if you have to put your Lambda function in a VPC. 
   - Amazon S3 can be used as an inexpensive way to store state data if throughput is not critical and the type of state data you are saving will not change rapidly.
- **Only include what you need**
Minimize both your deployment package dependencies and its size.
This can have a significant impact on the startup time for your function. For example, only choose the modules that you need — do not include an entire AWS SDK.
Reduce the time it takes Lambda to unpack deployment packages authored in Java. 
Put your dependency .jar files in a separate /lib directory.

3. **Best practices for writing code**
   When it comes to writing code, there are a few practices that are important to follow.
   - **Include logging statements**
     Lambda functions can and should include logging statements, which are written to CloudWatch.Implement structured logging throughout your applications. Most runtimes provide libraries to help use structured logging.
   - **Use Return coding**
     Functions must give Lambda information about the results of their actions. Use the return coding appropriate for your selected programming language to exit your code. For languages such as Node.js, Lambda provides additional methods on the context object for callbacks. You use these context-object methods to tell Lambda to terminate your function and optionally return values to the caller.
    - **Provide environment variables**
  Take advantage of environment variables for operational parameters.You can use these parameters to pass updated configuration settings without changes to the code itself. You create an environment variable on your function by defining a key and a value. Your function uses the name of the key to retrieve the value of environment variable.
    - **Add secret and reference data**
      AWS Secrets Manager helps you organize and manage important configuration data such as credentials, passwords, and license keys.
    - **Add recursive code**
      Avoid a situation in which a function calls itself. Recursive code could lead to uncontrolled scaling of invocations that would make you lose control of your concurrency.
  - **Gather metrics with cloudWatch**
  The CloudWatch embedded metric format (EMF) is a JSON specification used to instruct CloudWatch Logs to automatically extract metric values embedded in structured log events. You can use CloudWatch to graph and create alarms on the extracted metric values.
  - **Resue execution context**
    Take advantage of an existing execution context when you get a warm start by doing the following:
    1. Store dependencies locally.
    2. Limit re-initialization of variables.
    3. Reuse existing connections.
    4. Use tmp space as transient cache.
    5. Check that background processes have completed.      
  
