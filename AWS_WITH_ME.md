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
- Producers are users who create the events. Events contain all the necessary information required for the consumers to take action on the event.
- The router ingests, filters, and pushes the events to the appropriate consumers. It does this by using a set of rules or another service, such as Amazon Simple Notification Service (Amazon SNS), to send the messages.
- Consumers subscribe to be notified about the events, or they can monitor an event stream and act on events that pertain only to them.
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
  
## Building Lambda functions
1. Lambda console editor
2. Deployment packages
3. Automate using tools
   
**What is AWS SAM?**

AWS SAM is an open-source framework for building serverless applications. It provides shorthand syntax to express functions, APIs, databases, and event source mappings. With just a few lines per resource, you can define the application you want and model it using YAML. You provide AWS SAM with simplified instructions for your environment and during deployment AWS SAM transforms and expands the AWS SAM syntax into AWS CloudFormation syntax (a fully detailed CloudFormation template). All CloudFormation options are still available within AWS SAM. AWS SAM just makes it easier to set up the resources commonly needed for serverless applications. 

**Serverless CI/CD Pipeline**
![image](https://github.com/user-attachments/assets/e5fae94c-4e63-4971-98c2-98e1325153fa)
You can incorporate additional tools to create an automated CI/CD pipeline for your serverless applications that integrate with AWS SAM. 

- CodeBuild – Automate the process of packaging code and running tests before the code is deployed.
- CodeDeploy – Use version management options to ensure safe deployments to production. 
## Configuring Your Lambda Functions
When building and testing a function, you must specify three primary configuration settings: memory, timeout, and concurrency. These settings are important in defining how each function performs. Deciding how to configure memory, timeout, and concurrency comes down to testing your function in real-world scenarios and against peak volume. As you monitor your functions, you must adjust the settings to optimize costs and ensure the desired customer experience with your application.
![image](https://github.com/user-attachments/assets/79d71fea-920f-4952-bb06-29b0c9183cc2)
**Memory**
You can allocate up to 10 GB of memory to a Lambda function. Lambda allocates CPU and other resources linearly in proportion to the amount of memory configured. Any increase in memory size triggers an equivalent increase in CPU available to your function.
**Timeout**
The AWS Lambda timeout value dictates how long a function can run before Lambda terminates the Lambda function. At the time of this publication, the maximum timeout for a Lambda function is 900 seconds. This limit means that a single invocation of a Lambda function cannot run longer than 900 seconds (which is 15 minutes). 
**Concurrency and scaling**
- Unreserved concurrency
- Reserved concurrency
- Provisioned concurrency
**How concurrency bursts are managed**
A burst is when there is a sudden increase in the number of instances needed to fulfill the requested number of running functions. An example is an increase in orders on a website during a limited time sale. The burst concurrency quota is not per function. It applies to all of your functions in the Region.
**CloudWatch metrics for concurrency**

When your function finishes processing an event, Lambda sends metrics about the invocation to Amazon CloudWatch. You can build graphs and dashboards with these metrics in the CloudWatch console. You can also set alarms to respond to changes in use, performance, or error rates.

CloudWatch includes two built-in metrics that help determine concurrency: ConcurrentExecutions and UnreservedConcurrentExecutions.

**Testing concurrency**

The most important factor for your concurrency, memory, and timeout settings is to verify application testing against real-world conditions. To do this, follow these suggestions:

- Run performance tests that simulate peak levels of invocations.
    - View the metrics for the amount of throttling that occurs during performance peaks.
- Determine whether the existing backend can handle the speed of requests sent to it.
    - Don't test in isolation. If you’re connecting to Amazon Relational Database Service (Amazon RDS), ensure that you test that the concurrency levels for your function can be processed by the database.
- Does your error handling work as expected? 
   - Tests should include pushing the application beyond the concurrency settings to verify correct error handling.
## Deploying and Testing Serverless Applications
AWS Serverless Application Model (AWS SAM), can simplify your deployment practices. AWS SAM can make the move to serverless more efficient. 
The AWS CloudFormation template is considered the blueprint for the Lambda function.

The CloudFormation template specifies every detail of the Lambda function and the environment required for the Lambda function to run.

**AWS SAM makes serverless development easier.**

Earlier in the course, you learned that AWS SAM uses a set of CloudFormation commands. When you provide AWS SAM with simplified instructions for your environment, it transforms that information into the fully detailed CloudFormation template that you can use to build your stack. All CloudFormation options are still available within AWS SAM. The service streamlines the configuration of commonly used serverless application resources.
1. how to create, edit, and deploy a Lambda function by using AWS SAM and AWS Cloud9
**Monitoring and Troubleshooting**
AWS Lambda integrates with other AWS services to help you monitor and troubleshoot your Lambda functions
how to use these AWS services to monitor, trace, debug, and troubleshoot your Lambda functions and applications.
Types of monitoring graphs

AWS Lambda automatically monitors Lambda functions on your behalf and reports metrics through Amazon CloudWatch. To help you monitor your code when it runs, Lambda automatically tracks the following:
 - Number of requests
 - Invocation duration per request
 - Number of requests that result in an error

1. Invocations
   The number of times your function code is run, including successful runs and runs that result in a function error. If the invocation request is throttled or otherwise resulted in an invocation error, invocations aren't recorded.
2. Duration
   The amount of time that your function code spends processing an event. The billed duration for an invocation is the value of Duration rounded up to the nearest millisecond.
3. Errors
   The number of invocations that result in a function error. Function errors include exceptions thrown by your code and exceptions thrown by the Lambda runtime. The runtime returns errors for issues such as timeouts and configuration errors.
4. Throttles
   The number of times that a process failed because of concurrency limits. When all function instances are processing requests and no concurrency is available to scale up, Lambda rejects additional requests.
5. IteratorAge
   Pertains to event source mappings that read from streams. The age of the last record in the event. The age is the amount of time between when the stream receives the record and when the event source mapping sends the event to the function.
6. DeadLetterErrors
   For asynchronous invocation, this is the number of times Lambda attempts to send an event to a dead-letter queue but fails. 
7. ConcurrentExecutions
The number of function instances that are processing events.
You can also view metrics for the following:

- UnreservedConcurrentExecutions – The number of events that are being processed by functions that don't have reserved concurrency. 
- ProvisionedConcurrentExecutions – The number of function instances that are processing events on provisioned concurrency. For each invocation of an alias or version with provisioned concurrency, Lambda emits the current count.
**Amazon CloudWatch Lambda Insights**
Amazon CloudWatch Lambda Insights is a monitoring and troubleshooting solution for serverless applications running on Lambda. Lambda Insights collects, aggregates, and summarizes system-level metrics. It also summarizes diagnostic information such as cold starts and Lambda worker shutdowns to help you isolate issues with your Lambda functions and resolve them quickly.
**Additional monitoring and troubleshooting tools**
  1. AWS CloudTrail
  AWS CloudTrail helps audit your application by recording all the API actions made against the application. These logs can be exported to the analysis tool of your choice for additional analysis. 
CloudTrail logging provides the following options:
- The default Lambda CloudTrail logging is for control plane (management) events.
- Optional logging: CloudTrail also logs data events. You can turn on data event logging so that you log an event every time Lambda functions are invoked.
CloudTrail can be an important tool for auditing serverless deployments and rolling back unplanned deployments.
  3. Dead letter queues
  Dead-letter queues help you capture application errors that must receive a response, such as an ecommerce application that processes orders. If an order fails, you cannot ignore that order error. You move that error into the dead-letter queue and manually look at the queue and fix the problems.

- Use dead-letter queues to analyze failures for follow-up or code corrections.
- Dead-letter queues are available for asynchronous and non-stream polling events.
- A dead-letter queue can be an Amazon Simple Notification Service (Amazon SNS) topic or an Amazon Simple Queue Service (Amazon SQS) queue.

## Amazon API Gateway for Serverless Applications
  API Gateway lets you define and deploy application programming interfaces (APIs) at scale, and why it makes a great front door to your AWS Lambda functions and backend APIs. 
**Course objectives**
By the end of this course, you should be able to:

- Identify initial use cases where API Gateway and Lambda can decouple a larger monolith.
- Identify a plan for your application for managing APIs that includes endpoint selection, caching configurations, authorization methods, usage plans, and deployment stages.
- Identify how to build real-time messaging communication applications using WebSocket APIs.
- Use the API Gateway console to create an API from scratch, test it with a mock endpoint, and deploy it using an available authorization option.
- Use Amazon CloudWatch to analyze the traffic on your deployed API and identify opportunities or improvements, validations, responses, and mapping.
- Use API Gateway as an event source for a Lambda function using Lambda Aliases and API Gateway Stage Variables.

**The challenges of API management**

Although there are many benefits to using APIs, you can also encounter commonly occurring challenges while managing your APIs. Some of these challenges include:

- Handling API calls in a serverless application
- Working with multiple API versions and environments
- Controlling access and authorization
- Managing traffic spikes
- Monitoring third-party access
**API Gateway features**
  1. Developer features in API Gateway
     - Run multiple versions of an API at the same time
       With API Gateway, you can run multiple versions of the same API simultaneously so that you can quickly iterate, test, and release new versions. You can 
       make changes to your API and host multiple versions of it for different users also.
     - Quick SDK generation
       If you’re using REST APIs, API Gateway can generate client Software Development Kits (SDKs) for several platforms, which you can use to quickly test new 
       APIs from your applications and distribute SDKs to third-party developers.
     - Transform or validate request-response data
       With API Gateway, you can also transform and validate both incoming and outgoing requests. With this feature, you can use API Gateway as a fully managed 
       environment for transforming requests as they come into your API before they are passed to your backend.
 2. Features for managing API access
    here are also some important features for managing API access. To learn more, expand each of the following three categories.
    - Reduce latency and throttle traffic
      API Gateway provides end users with the lowest possible latency for API requests and responses by taking advantage of the Amazon CloudFront global network 
      of edge locations. With this service, you also can throttle traffic and authorize API calls to ensure that backend operations withstand traffic spikes and 
      backend systems are not unnecessarily called.

    - Built-in, flexible authorization options
      API Gateway gives you several options for authorization. You can authorize access to your APIs with AWS Identity and Access Management (IAM) and Amazon 
      Cognito. If you use OAuth tokens, API Gateway also offers native OpenID Connect (OIDC) and OAuth 2 support. 

      To support custom authorization requirements, you can invoke a Lambda authorizer from Lambda. With a Lambda authorizer, you can develop your own 
      authorization code using a custom Lambda function.
    - API keys for third-party developers
      If you’re using REST APIs, API Gateway helps you manage the ecosystem of third-party developers accessing your APIs. You can create API keys on API Gateway, 
      set fine-grained access permissions on each API key, and distribute them to third-party developers to access your APIs. API keys are not a primary 
      authorization mechanism for your APIs, but provide you the ability to track usage for specific users or services.

      You can also define usage  plans that set throttling and request quota limits for each API key. The use of API keys is optional.

3. API Gateway architecture
   ![image](https://github.com/user-attachments/assets/fda5bb9e-1bff-4095-8623-1b03a6487920)

4. Selecting the best API type for your use case
   API Gateway offers two options to create RESTful APIs—REST APIs and HTTP APIs—and an option to create WebSocket APIs. To learn more about these API types, choose the appropriate tab.
   - Rest API
REST stands for representational state transfer. REST defines a set of functions such as GET, PUT, and DELETE that clients can use to access server data. Clients and servers exchange data using HTTP.

The main feature of a REST API is statelessness. Statelessness means that servers do not save client data between requests. Client requests to the server are similar to URLs you type in your browser to visit a website. The response from the server is plain data, without the typical graphical rendering of a web page.

REST APIs offer API proxy functionality and API management features in a single solution. REST APIs also offer API management features such as usage plans, API keys, publishing, and monetizing APIs.
![image](https://github.com/user-attachments/assets/0882f27f-467b-4e2e-ab93-4fb13d6405ae)
- **HTTP API**
With Hypertext Transfer Protocol (HTTP) APIs, you can create RESTful APIs with lower latency and lower cost than REST APIs. You can use HTTP APIs to send requests to Lambda functions or to any routable HTTP endpoint.
HTTP APIs are optimized for building APIs that proxy to Lambda functions or HTTP backends, making them ideal for serverless workloads. They do not currently offer API management functionality.
For example, you can create an HTTP API that integrates with a Lambda function on the backend. When a client calls your API, API Gateway sends the request to the Lambda function and returns the function's response to the client.

- **Websocket API**
  WebSocket APIs offer APIs that the client can access through the WebSocket protocol. Unlike REST and HTTP APIs, WebSocket APIs allow bidirectional communications. WebSocket APIs are often used in real-time applications such as chat applications, collaboration platforms, multiplayer games, and financial trading platforms.
WebSocket APIs maintain a persistent connection between connected clients to facilitate real-time message communication. With WebSocket APIs in API Gateway, you can define backend integrations with Lambda functions, Amazon Kinesis, or any HTTP endpoint to be invoked when messages are received from the connected clients.
![image](https://github.com/user-attachments/assets/cbbb01a0-e21f-4c1d-a50b-91897f29d4e3)

5. **Choosing between RESTful APIs and WebSocket APIs**
Using API Gateway, you can build and deploy both RESTful APIs and WebSocket APIs. Now that you have an introduction to these API types, this table compares a few features of each to help you choose the right API type.
![image](https://github.com/user-attachments/assets/19155dc0-e844-4a12-a36b-b8640c2622d2)
REST APIs are intended for APIs that require API proxy functionality and API management features in a single solution. HTTP APIs are optimized for building APIs that proxy to Lambda functions or HTTP backends, making them ideal for serverless workloads. HTTP APIs are a cheaper and faster alternative to REST APIs, but they do not currently support API management functionality. Unlike a REST API, which receives and responds to requests, a WebSocket API supports two-way communication between client apps and your backend. The backend can send callback messages to connected clients.

6. **Designing WebSocket APIs**
   - **Real-time message communication with WebSocket APIs**
     In a WebSocket API, the client and server can send messages to each other at any time. With a WebSocket connection, your backend servers can push data to 
     connected users and devices, avoiding the need to implement complex polling mechanisms.
     ![image](https://github.com/user-attachments/assets/641f2052-cac1-4556-a2f4-e217e3198d6c)
  - Benefits and use cases of WebSocket APIs
    API Gateway WebSocket APIs are designed for bidirectional communication between your client and backend architecture. You can do this by using any WebSockets client such as a mobile app, chat app, AWS IOT device, or application dashboard.
 WebSocket APIs are often used in real-time application use cases such as:
- Chat applications
- Streaming dashboard
- Real-time alerts and notifications
- Collaboration platforms
- Multiplayer games
- Financial trading platforms
7. **Pricing considerations for WebSocket APIs**
  - Flat Charge
  - Connection Minuites
  - Additional Charges
8. **Developing a WebSocket API in API Gateway**
    - Creating and configuring WebSocket APIs
      To create a functional API, you must have at least one route, integration, and stage before deploying the API.
      1. Add routes
      2. Route Selection expression
         The route selection expression is an attribute defined at the API level. It specifies a JSON property that is expected to be present in the message payload.
      3. Attach integrations
          After setting up an API route, you must integrate it with an endpoint in the backend. A backend endpoint is also referred to as an integration endpoint and can be a Lambda function, an HTTP endpoint, or an AWS service action. The API integration has an integration request and an integration response.
      4. Add stages
         In API Gateway, stages are similar to tags. They define the path through which the deployment is accessible.
      5. Review and Create
9. **Using WebSocket routes**
With WebSocket APIs in API Gateway, JSON messages can be routed to invoke a specific backend service based on message content. When a client sends a message over its WebSocket connection, this results in a route request to the WebSocket API. The request will be matched to the route with the corresponding route key in API Gateway. 

There are three predefined routes that can be used with WebSocket APIs: $connect, $disconnect, and $default. In addition to the predefined routes, you can also create custom routes. Select each hotspot to learn about the predefined routes and custom routes API Gateway WebSocket APIs offer.
 - **Predefined routes**
 1. **$connect route**
API Gateway calls the $connect route when a persistent connection between the client and a WebSocket API is being initiated.
2. **$disconnect route**
API Gateway calls the $disconnect route when the client or server disconnects from the API. The $disconnect route is invoked after the connection is closed.
The connection can be closed by the server or the client. As the connection is already closed when it is executed, $disconnect is a best-effort event. API Gateway will try its best to deliver the $disconnect event to your integration, but it cannot guarantee delivery.
3. **$default route**
Every API Gateway WebSocket API can have a $default route. This is a special routing value that can be used in the following ways.
4. **Custom route**
Invoke a specific integration based on message content by creating a custom route.
A custom route uses a route key and integration that you specify. When an incoming message contains a JSON property, and that property evaluates to a value that matches the route key value, API Gateway invokes the integration.

10 **WebSocket API integrations**
After setting up an API route, you must integrate it with an endpoint in the backend. A backend endpoint is also referred to as an integration endpoint and can be a Lambda function, an HTTP endpoint, or an AWS service action. The API integration has an integration request and an integration response option.   
- Integration Request
- Integration Response
11. **WebSocket selection expressions**
API Gateway uses selection expressions as a way to evaluate the request and response context and produce a key. This key is then used to select from a set of possible values that you provide. The selection expressions that you can use include:
- Route response selection expressions, which are used for modeling a response from the backend to the client
- API key selection expressions, which are evaluated when the service determines the given request should proceed only if the client provides a valid API key
- API mapping selection expressions, which are evaluated to determine which API stage is selected when a request is made using a custom domain
12 . **Maintaining connections to WebSocket APIs**
  To understand how the WebSocket connections are maintained, you need to understand how the client connects, sends messages, and disconnects from the API. To learn more, expand each of the following three categories.
  - Connect
    The client apps connect to your WebSocket API by sending a WebSocket upgrade request. If the request succeeds, the $connect route is invoked while the connection is being established. Until the invocation of the integration you associated with the $connect route is completed, the upgrade request is pending and the actual connection will not be established. If the $connect request fails, the connection will not be made.
  - Established connection
    After the connection is established, your client's JSON messages can be routed to invoke a specific backend service based on message content. When a client sends a message over its WebSocket connection, this results in a route request to the WebSocket API. The request will be matched to the route with the corresponding route key in API Gateway.
  - Disconnect
      The $disconnect route is invoked after the connection is closed. The connection can be closed by the server or by the client. As mentioned earlier in the lesson, since the connection is already closed when it is invoked, the $disconnect route is a best-effort event. API Gateway will try its best to deliver the $disconnect event to your integration, but it cannot guarantee delivery. The backend can initiate disconnection by using the @connections API. 

## REST APIs
REST API in API Gateway is a collection of resources and methods that are integrated with backend HTTP endpoints, Lambda functions, or other AWS services. API Gateway REST APIs use a request-response model, where a client sends a request to a service and the service responds back synchronously. This kind of model is suitable for many different kinds of applications that depend on synchronous communication.
1. **API Gateway REST API endpoint types**
Before you start designing your APIs, you will need to decide the type of endpoint that makes sense for the traffic and usage patterns you anticipate.
- Regional endpoint
he regional endpoint is designed to reduce latency when calls are made from the same AWS Region as the API. In this model, API Gateway does not deploy its own CloudFront distribution in front of your API. Instead, traffic destined for your API will be directed straight at the API endpoint in the Region where you’ve deployed it.

This endpoint type gives you lower latency for applications that are invoking your API from within the same Region (for example, an API that is going to be accessed from EC2 instances within the same Region). 

The regional endpoint provides you with the flexibility to deploy your own CloudFront distribution or content delivery network (CDN) in front of API Gateway and control that distribution using your own settings for customized scenarios. An example of this might be to design for disaster recovery scenarios or implement load balancing in a very customized way.
- Edge-optimized endpoint
The edge-optimized endpoint is designed to help you reduce client latency from anywhere on the internet. If you choose an edge-optimized endpoint, API Gateway will automatically configure a fully managed CloudFront distribution to provide lower latency access to your API.

This endpoint-type setup reduces your first hit latency for your API. An additional benefit of using a managed CloudFront distribution is that you don’t have to pay for or manage a CDN separately from API Gateway.
![image](https://github.com/user-attachments/assets/5deaf66b-99df-4af6-8fb5-baae458496c1)
- Private endpoint
The private endpoint is designed to expose APIs only inside your selected Amazon Virtual Private Cloud (Amazon VPC). This endpoint type is still managed by API Gateway, but requests are only routable and can only originate from within a single virtual private cloud (VPC) that you control.

This endpoint type is designed for applications that have very secure workloads, such as healthcare or financial data that cannot be exposed publicly on the internet. There are no data transfer-out charges for private APIs. However, AWS PrivateLink charges apply when using private APIs in API Gateway.
![image](https://github.com/user-attachments/assets/717b9d14-3f76-452e-8a33-fddc878d05ed)

The following endpoint type changes are supported:
1. From edge-optimized to regional or private
2. From regional to edge-optimized or private
3. From private to regional
You cannot change a private API endpoint into an edge-optimized API endpoint.
2. **API Gateway optional cache**
You can turn on API caching in API Gateway to cache your endpoint's responses. With caching, you can reduce the number of calls made to your endpoint and also improve the latency of requests to your API. This configuration only available for REST APIs,
**Why use API Gateway caching**
When caching is turned on, API Gateway caches responses from your endpoint for a specified Time-to-Live (TTL) period. API Gateway then responds to a request by looking up the endpoint response from the cache instead of making a request to your endpoint. There are two big benefits of using the cache:
- It reduces overall latency for serving requests.
- It minimizes the number of requests that need to be made to your backend.
This becomes even more valuable as you scale and want to reduce the amount of calls to your backend resources.
![image](https://github.com/user-attachments/assets/fcf3850e-bcd8-4112-8962-f65696b3ec7e)
1. **Configure caching per API stage**
a stage is a named reference to a specific API deployment. Configuration choices for stage caching include the following.

2. **Provision between 0.5 GB and 237 GB of cache**
When you turn on caching, you can configure the size of the cache anywhere from half a gig to 237 gigabytes, and you can also configure and customize the maximum TTL for each cache entry. 
3. **Set TTL in seconds**
The default TTL value for API caching is 300 seconds. The maximum TTL value is 3,600 seconds. When you set TTL=0, caching is turned off within API Gateway.
4. **Turn on encryption of cache data**
You can also encrypt the cached data if you need to. 

5. **Only GET methods will be cached**
When you turn on caching in a stage's cache settings, only GET methods are cached. We recommend that you don’t cache other types of calls unless you have very specific reasons. 

6. **Configure per method**
You can override stage-level settings for individual methods. Turn caching on or off for specific methods, increase or decrease the TTL, or turn encryption on or off for cached responses.
You can also use parameters in the method to form cache keys so that API Gateway caches the method's responses depending on the parameter values used.
7. **Managing the API Gateway cache**
Caching is charged at an hourly rate

Keep in mind that data caching is charged at an hourly rate that is dependent on the cache size you select, regardless of the number of API calls being cached. So be thoughtful in choosing the cache size, and consider the amount of data you intend to cache. Two ways to verify caching:

- CloudWatch Metrics: CacheHitCount and CacheMissCount.
- Create a timestamp and include it in your API response.

**Pricing considerations for REST APIs**
With API Gateway, you only pay when your APIs are in use. When considering the pricing model for REST APIs, there are two different aspects to consider.
- Flat Charge
- Data Transfer Out
- Opetional Cache
## Building and Deploying APIs with API Gateway
**The base API invoke URL follows a pattern**
First you need to understand the structure of the URL that you will use to call your API. When you deploy your API, you deploy to a stage, which will be discussed shortly. At that point, a base URL is generated and displayed on the API stage editor. That base URI is called the invoke URL, and its composition will look like this:
![image](https://github.com/user-attachments/assets/968e7243-8f82-4f97-b7e4-0aa14ac84d3d)
All of the APIs you create with API Gateway will follow the same pattern as you see in the invoke URL above, reflecting the ID of the API and the Region in which you created it, followed by a stage, and then the resource and resource path you want to expose.
- Customize the hostname
  You can make the URL more meaningful to your users by using a custom domain name as the host and choosing a base path to map the alternative URL to your API. In most cases, you’ll want to use custom domains because they are more user friendly than the invoke URL. In addition, API Gateway is integrated with AWS Certificate Manager (ACM) and lets you import your own certificate or generate a Secure Sockets Layer (SSL) certificate with ACM.

**Steps to build an API with API Gateway**
The basic steps for creating an API from the API Gateway console can be mapped directly to the API breakdown of the invoke URL. You can use the API Gateway console to name your APIs, associate resources with that API, attach methods and integrations to resources, and also test your API methods from the console.
1. Choose an API type
   ![image](https://github.com/user-attachments/assets/592151ab-2872-4983-9816-1fe028cdae94)
2. Create the API
   ![image](https://github.com/user-attachments/assets/30101db6-14ed-4ad3-9675-39e0f8c9483c)
3. Add Resources
Use the Actions > Create Resource option to create a new resource. When you do this, you are creating addressable resources as a tree of API resource entities, with the root resource at the top of the hierarchy. The root resource is relative to the API's base URL.

You can create parent-child relationships among your resources for an API, and you can specify path parameters using curly brackets.
   ![image](https://github.com/user-attachments/assets/9ffd2382-7c17-45b9-9fa7-b2018c12f688)

4. Configure resource as proxy
When adding a resource, you have the option to create a proxy resource as well. If you choose this option, it will automatically create a special HTTP method called ANY.

A proxy resource is expressed by a special resource path parameter of {proxy+}, often referred to as a greedy path parameter. The plus sign (+) indicates child resources appended to it.
   ![image](https://github.com/user-attachments/assets/83adf86d-2574-4774-814c-799a6cf010bc)
   In addition to the HTTP proxy, there is also a Lambda proxy option. With the Lambda proxy integration, the client can call a single Lambda function in the backend. The function accesses many resources or features of other AWS services, including calling other Lambda functions.

To use the proxy option, you first configure the resource as a proxy resource and then set up an integration type of either HTTP or Lambda proxy when creating the method.

5. Create method
Once you’ve created the resource, you can associate methods with your resources. When you select Create Method from the Actions menu, you will be prompted to choose an HTTP verb such as GET, POST, or OPTIONS.

After this is done, you will be prompted to complete the other set-up items, including timeout and integration type.

Depending on the integration type you select, you will have to provide different details.
![image](https://github.com/user-attachments/assets/b1a76668-00fa-45d1-8af7-978a2ee584bc)

**API Gateway integration types**
When you choose an integration type, that determines how method request data is passed to the backend. As part of creating the method, you must choose an integration type. To learn more, expand each of the following five categories.
- Lambda Fucntion
- HTTP Endpoint
- AWS Service
- Mock
- VPC Link
**Edit Method Details**
  Once you’ve saved the details of the integration type, the console will display panels where you can add to your request-response details.
  ![image](https://github.com/user-attachments/assets/06e7a7fd-4c34-494b-bc01-5bce2e409c4b)
**Test your API methods**
  Now that you’ve filled in all of the API details, you can use the console to test it. When you select the test option, you’ll be prompted for any required values and can run your tests.
  ![image](https://github.com/user-attachments/assets/9f377563-652f-4f3d-a3d5-3455fdbfe7f3)
**Test results**

The results of the method invocation include:
- Request: Request is the resource's path that was called for the method.
- Status: Status is the response's HTTP status code.
- Latency: Latency is the time between the receipt of the request from the caller and the returned response.
- Response Body: Response Body is the HTTP response body.
- Response Headers: Response Headers are the HTTP response header.
**Response logs**
  Test results include simulated CloudWatch logs. No data is actually written to CloudWatch when testing. 

The output shows the state changes from the method request to the integration request, and from the integration response to the method response. 

This can be useful for troubleshooting any mapping errors that cause the request to fail. In this example, no mapping transformations were applied.

**API stages**
When you are ready to make your API callable for your users, you need to deploy your API to a stage.

A stage is a snapshot of the API and represents a unique identifier for a version of a deployed API.
With stages, you can have multiple versions and roll back versions. Anytime you update anything about the API, you need to redeploy it to an existing stage or to a new stage that you create as part of the deploy action.
![image](https://github.com/user-attachments/assets/0f658d20-5a50-44be-92e6-30795bd1091f)
1. Stage options
Critical design options that were discussed earlier in the course are set per stage including: 

- Caching
- Throttling
- Usage plans
2. **Differentiate your APIs with stages**
Some options for you to differentiate your APIs with stages include:
- Use different stages by environment or customer.
- Use stage variables to increase deployment flexibility.
- Use stages with canary deployments to test new versions.
**Simplify version management with stage variables**
As you define variables in the stage settings in the console, you can reference them with the *$stageVariables.[variable name]* notation. You can also inject stage-dependent items at runtime such as:
- URL's
- Lambda functions
- Any necessary variables
**Stage variable example**
  This example demonstrates how you can manage stage variables in the console. Two stages are defined in this example; a demo stage and a production stage.
  ![image](https://github.com/user-attachments/assets/8c6c0f12-f2a0-48bd-b109-3fa433f7eeab)
  ![image](https://github.com/user-attachments/assets/e5f4f586-f340-4e63-82e2-cf5ad490cad0)
**Lambda Function integration**

The first integration point is integrating with a Lambda Function type. Rather than specifying the function name in the setup, the stage variable notation is used with the lambdaFn variable.
![image](https://github.com/user-attachments/assets/8b405ae3-1bcc-489c-84aa-8cf922e65538)

**HTTP integration**

The second integration point is using an HTTP integration type. Rather than specifying the URL in the setup, the stage variable notation is used with the url variable.
![image](https://github.com/user-attachments/assets/119f4f72-258b-4f2e-bceb-62c3be8b6ba3)
By performing these actions, at runtime, the proper value is retrieved dynamically for both of those variables. Using stage variables is especially valuable as you move toward an automated continuous integration and continuous delivery (CI/CD) pipeline.

**Building and deploying best practices**
1. Use API Gateway stages with Lambda aliases

To highlight something that was mentioned in the previous example, Lambda and API Gateway are both designed to support flexible use of versions. You can do this by using aliases in Lambda and stages in API Gateway. When you couple that with stage variables, you don't have to hard-code components, which leads to having a smooth and safe deployment.

- In Lambda, enable versioning and use aliases to reference.
- In API Gateway, use stages for environments.
- Point API Gateway stage variables at the Lambda aliases.
2. Use Canary deployments

With Canary deployments, you can send a percentage of traffic to your "canary" while leaving the bulk of your traffic on a known good version of your API until the new version has been verified. API Gateway makes a base version available and updated versions of the API on the same stage. This way, you can introduce new features in the same environment for the base version.
![image](https://github.com/user-attachments/assets/409e7ff1-43bb-4658-89ec-a0331f2cc3e9)
Consider you want to add a new GET method to a petStore API with a
 /store/products API resource without impacting clients. To do this, you can create a canary that sends 10 percent of traffic to the canary with the new method.


**Use AWS SAM to simplify deployments**
One of the challenges of serverless deployments is the need to provide all the details of your deployment environment as part of your deployment package. The AWS Serverless Application Model (AWS SAM) is an open-source framework that you can use to build serverless applications on AWS. 
There are some best practices for deploying your APIs and serverless applications to production using AWS SAM as your application framework. To learn more, expand each of the following two categories.
- Using AWS SAM templates
  AWS SAM provides templates that help you define your serverless applications. These template specifications provide you with a straightforward and clean syntax to describe your functions, APIs, permissions, configurations, and events. You use an AWS SAM template file to operate on a single, deployable, versioned entity that makes up your serverless application.
  AWS SAM is an extension of AWS CloudFormation, so it gives you the deployment capabilities and the full suite of resources available in CloudFormation. The AWS SAM template file closely follows the format of a CloudFormation template file.
- Use Swagger and OpenAPI for more complex APIs
  AWS SAM also supports OpenAPI to define more complex APIs. This can either be 2.0 for the Swagger specification, or one of the OpenAPI 3.0 versions, like 3.0.1. OpenAPI is an industry-standard way to document and design your APIs. 

With SAM, you can document your API in an external OpenAPI or Swagger file, and then reference that in a SAM template.

## Managing API Access
**Managing access to APIs**
How you will manage access and authorization for the API. API Gateway provides you with multiple, customizable options for:
- Authorizing an entity to access your APIs
- Providing more granular control
- Controlling the amount of access through throttling
**Authorization and authentication comparison**
  Each of these, authorization and authentication, have advantages that should be matched to both your application needs and your organizational standards. This table shows a comparison of authorization and authentication options and features that they are compatible with.
  ![image](https://github.com/user-attachments/assets/60c45409-2844-4ca1-8465-16e7776cb5a9)
**Authorization for API Gateway**
  As shown in the comparison table, there are three main ways to authorize API calls to your API Gateway endpoints:
  - Use IAM and Signature version 4 (also known as Sig v4) to authenticate and authorize entities to access your APIs.
  - Use Lambda Authorizers, which you can use to support bearer token authentication strategies such as OAuth or SAML.
  - Use Amazon Cognito with user pools.
**Authorizing with IAM**
If you have an internal service or a restricted number of customers, IAM is a great choice for authorization, especially for applications that use IAM to interact with other AWS services using IAM roles. To learn more about the signing process, select each hotspot.
![image](https://github.com/user-attachments/assets/942e2247-f5cb-4066-ae2a-46c3ac2ea7b6)
The key information is added to the Authorization header and behind the scenes, API Gateway will take that signed request, parse it, and determine whether the user who signed the request has the IAM permissions to invoke your API.
If not, API Gateway will simply deny and reject that request. So for this type of authentication, your requestor must have AWS credentials.

**Lambda Authorizers**
You also need to consider what you already have in place that should be used. If you are using an OAuth strategy as an organization, you may want to consider Lambda Authorizer.
![image](https://github.com/user-attachments/assets/a6c28949-4771-49ad-b3cf-1437859815f7)
- A Lambda Authorizer is a Lambda function that you can write to perform any custom authorization that you need. There are two types of Lambda Authorizers: Token and Request.
- When a client calls your API, API Gateway verifies whether a Lambda Authorizer is configured for the API method. If so, API Gateway calls the Lambda function.
- In this call, API Gateway supplies the authorization token (or the request parameters based on the type of authorizer), and the Lambda function returns a policy that allows or denies the caller’s request.
- API Gateway also supports an optional policy cache that you can configure for your Lambda Authorizer. This feature increases performance by reducing the number of invocations of your Lambda Authorizer for previously authorized tokens. With this cache, you can configure a custom TTL.
![image](https://github.com/user-attachments/assets/741017e8-d500-4302-b15e-396cfaaf38ee)
To make it easy to get started with this method, you can choose the API Gateway Lambda Authorizer blueprint when creating your authorizer function from the Lambda console.
There are two types of Lambda Authorizers you should be aware of: Token and Request
**Lambda Authorizer token types**
  For token-type Lambda Authorizers, API Gateway passes the source token to the Lambda function as a JSON input. Based on the value of this token, your Lambda function will determine whether to allow the request. 
![image](https://github.com/user-attachments/assets/b84d9469-b8e4-4cb4-80a1-133fa46dcaab)
- API Gateway passes the source token to the Lambda function as a JSON input. Based on the value of this token, your Lambda function will determine whether to allow the request.
- If the authorizer function allows the request, it will return an IAM policy that allows execute-API:Invoke on the particular API resources that you specified.
This lets a caller invoke the specified methods that are defined in the API in the JSON output.
If your Lambda function denies the request, you’ll need to return a JSON policy document that denies access to the API methods and resources specified.
In this case, the client receives a 403 error.
**Lambda Authorizer request types**
  Request-type Lambda Authorizers are useful if you need more information about the request itself before authorizing it.
  ![image](https://github.com/user-attachments/assets/ef5cada4-54de-433c-9597-4291d357c2e6)
  - With request-type authorizers, you can include additional payload in the JSON input to your Lambda function. 
    So if you want to make authorizations that are based on information found in the request header, query string parameters, or the body of the request, use the REQUEST type.
  - The Lambda function of the REQUEST authorizer type verifies the input request parameters and returns an Allow IAM policy on a specified method. 
The ALLOW will only be returned if all the required parameter values match the preconfigured ones. If they match, the caller can invoke the specified method. 
Otherwise, the authorizer function returns an Unauthorized error, without generating any IAM policy.
**Cognito Authorizers**
As an alternative to using IAM or Lambda authorizers, you can use Amazon Cognito and a Cognito User Pool to control access to your APIs.
![image](https://github.com/user-attachments/assets/cf52236c-ce96-4fd1-b852-485901fd6f82)

- Cognito user pools provide a set of APIs that you can integrate into your application to provide authentication.  User pools are intended for mobile or web applications where you handle user registration and sign-in directly in the application. In addition, with Cognito, you can create your own OAuth 2 resource servers and define custom scopes within them.
- To use an Amazon Cognito user pool with your API, you must first create an authorizer of the COGNITO_USER_POOLS authorizer type, and then configure an API method to use that authorizer.
- After a user is authenticated against the user pool, they obtain an OpenID Connect (OIDC) token formatted in a JSON web token. Users who have signed in to your application will have tokens provided to them by the user pool. Then that token can be used by your application to inject information into a header in subsequent API calls that you make against your API Gateway endpoint.
## Throttling and usage plans
With API Gateway, you can set throttle and quota limits on your API consumers. This can useful for things such as preventing one consumer from using all of your backend system’s capacity or to ensure that your downstream systems can manage the number of requests you send through. 
- **API KEYS** With API Gateway, you can create and distribute API keys to your customers, which can be used to identify the consumer and apply desired usage and throttle limits to their requests. Customers include the API key through x-API-key header in requests.
- **Usage plans** You can use API keys with usage plans to set up some very specific plans that make sense for your use case. For example, you can perform API key throttling based on a rate and a burst per API key. API key usage can also be used to meter daily, weekly, and monthly usage.
  You can set throttle and quota limits based on API keys through the usage plans feature. You can set up usage plans for:
  - API Key Throttling per second and burst
  - API Key Quota by day, week, or month
  - API Key Usage by daily usage records
![image](https://github.com/user-attachments/assets/537d94d3-147a-41e1-a65b-24912b952374)
- **Throttle requests per second** : In this example, you want to limit your mobile consumers to invoke your API at a maximum rate of 50 requests per second. 
- **Throttle with daily quota of 10,000 requests** :In this example, you want to enforce a quota of 10,000 requests per day for your partners.

**Token bucket algorithm**
- Burst: Maximum size of bucket
- Rate: Number of tokens (requests) added to bucket
**Throttling settings hierarchy**
The type and level of throttling applied to a request is dependent on all of the limits involved and are applied in this order:
1. Per-client, per-method throttling limits that you set for an API stage in a usage plan
2. Per-client throttling limits that you set in a usage plan
3. Default per-method limits and individual per-method limits that you set in API stage settings
4. The account level limit
**IAM permissions**
There are two types of IAM permissions for APIs:
![image](https://github.com/user-attachments/assets/25af0e8a-3b7b-4966-9182-d5fa90d28aa0)
When it comes to granting access to your APIs, you need to think about two types of permissions:
1. Who can invoke the API: To call a deployed API, or refresh the API caching, the caller needs the execute-api permission.
2. Who can manage the API: To create, deploy, and manage an API in API Gateway, the API developer needs the apigateway permission.
**Invoke permissions**
For the execute-api permission, you need to create IAM policies that permit a specified API caller to invoke the desired API method. To apply this IAM policy on the API method, you need to configure the API method to use an authorization type of AWS_IAM.
![image](https://github.com/user-attachments/assets/09f66ded-55f5-4307-9ee2-c531c2e457d5)
**Manage permissions**
To allow an API developer to create and manage an API in API Gateway, you need IAM permission policies that allow a specified API developer to create, update, deploy, view, or delete required API entities. To do that, create a policy using the apigateway:HTTP_VERB format, associated with the specific resource using the verb that you want to permit or deny in the policy.
![image](https://github.com/user-attachments/assets/4e420158-02f5-4fe1-89c5-06378ad0f58e)
**Resource policies**
Resource policies help you to further refine access for your APIs. While an IAM policy is used to grant permission to a user, group, or role, you can also apply policies directly on API Gateway using a resource policy. A resource policy is a JSON policy document that you attach to an API to limit access by users from a specified account, IP address range, VPC, or VPC endpoint. You can make this as granular as you need, and resource policies can be used in coordination with IAM policies to restrict access.
![image](https://github.com/user-attachments/assets/0a435e13-649a-4016-a9d3-f8676d9b1a72)

Limiting access by user example: In this example, the resource policy allows a user from another AWS account (account-id:user/George) to perform GET requests on the pets resource of our API.
![image](https://github.com/user-attachments/assets/64fc04fc-9f59-4698-a98b-18a96660664f)

Limiting by IP address example: This resource policy denies any user with a source IP address in one of two specified ranges from accessing the API. This is done by specifying an effect of DENY and an IpAddress condition with an array of source IP addresses.
![image](https://github.com/user-attachments/assets/553c26fa-c905-40bc-9999-e25995a59b55)

Limiting by VPC example: This resource policy denies anyone (indicated by the principal = *) who is NOT coming from the VPC specified as the sourceVpc within the Condition.

**Resource policies and authentication methods**
Resource policy and authentication methods work together to grant access to your APIs. As illustrated below, methods for securing your APIs work in aggregate.
- API Gateway resource policy only: Explicit allow is required on the inbound criteria of the caller. If not found, deny the caller.
- Lambda Authorizer and resource policy: If the policy has explicit denials, the caller is denied access immediately. Otherwise, the Lambda Authorizer is called and returns a policy document that is evaluated with the resource policy.
- IAM authentication and resource policy: If the user authenticates successfully with IAM, policies attached to the IAM user and resource policy are evaluated together.
             - If the caller and API owner are from separate accounts, both the IAM user policies and the resource policy MUST explicitly allow the caller to proceed.
             - If the caller and the API owner are in the same account, either user policies or the resource policy must explicitly allow the caller to proceed.

- Cognito authentication and resource policy: If API Gateway authenticates the caller from Cognito, the resource policy is evaluated independently.If there is an explicit allow, the caller proceeds. Otherwise, deny or neither allow nor deny will result in a deny.

## Monitoring and Troubleshooting
**CloudWatch Metrics for API Gateway**
After your APIs are deployed, you can use CloudWatch Metrics to monitor performance of deployed APIs. API Gateway has seven default metrics out of the box:
- Count: Total number of API requests in a period
- Latency: Time between when API Gateway receives a request from a client and when it returns a response to the client; this includes the integration latency and other API Gateway overhead
- IntegrationLatency: Time between when API Gateway relays a request to the backend and when it receives a response from the backend
- 4xxError: Client-side errors captured in a specified period
- 5xxError: Server-side errors captured in a specified period
- CacheHitCount: Number of requests served from the API cache in a given period
- CacheMissCount: Number of requests served from the backend in a given period, when API caching is turned on
 With these metrics, you can monitor details such as the following:
 - How often your APIs are being called
 - The number of invocations to your API
 - The latency of the API responses
 - If there are any errors, and if so, whether they are 400 errors or 500 errors
 - Whether your cache is being hit or how many times the backend needed to be called while caching was enabled
**Calculating API Gateway overhead**
Two key metrics that are used to calculate the API Gateway overhead of deployed APIs are the Latency and IntegrationLatency CloudWatch Metrics.
- The latency metric gives you details about how long it takes for a full round-trip response, from the second your customer invokes your API to when your API responds with the results. This is a full round-trip duration of an API request through API Gateway.
- Integration latency is how long it takes for API Gateway to make the invocation to your backend and receive the response.
The difference between these two metrics gives you your API Gateway overhead. Together, these metrics can help you fine-tune your applications and see where the bottlenecks are.
**CloudWatch Logs for API Gateway**
In addition to CloudWatch Metrics, you can also learn a lot about how your APIs are performing from CloudWatch Logs. API Gateway has two types of CloudWatch logs built in.
- Execution Logging
The first type is execution logging, which logs what’s happening on the roundtrip of a request. You can see all the details from when the request was made, the other request parameters, everything that happened between the requests, and what happened when API Gateway returned the results to the client that’s calling the service.
Execution logs can be useful to troubleshoot APIs, but can result in logging sensitive data. Because of this, it is recommended you don't enable Log full requests/responses data for production APIs. In addition, there is a cost component associated with logging your APIs.
![image](https://github.com/user-attachments/assets/7f6110b9-ae90-4026-ac12-d0dd075a872e)
- Access Logging
The second type is access logging, which provides details about who's invoking your API. This includes everything including IP address, the method used, the user protocol, and the agent that's invoking your API.
![image](https://github.com/user-attachments/assets/5c35a560-b9ac-4f1b-b282-beb0e813cf03)
Access logging is fully customizable using JSON formatting. If you need to, you can publish them to a third-party resource to help you analyze them.
**Monitoring with X-Ray and CloudTrail**
There are two AWS tools you should understand to analyze your API use and performance: AWS X-Ray and AWS CloudTrail.
1. AWS X-Ray
trace and analyze requests as they travel through your APIs to services:
-- Analyze latencies and debug errors in your APIs and their backend services.
-- Configure sampling rules to focus on specific requests.
2. AWS CloudTrail
CloudTrail, captures all API calls for API Gateway as events, including calls from the API Gateway console and from code calls to your API Gateway APIs.
CloudTrail captures all API calls for API Gateway as events.
-- IP address, requester, and time of request are included.
-- Event history can be reviewed.
-- Create a trail to send events to an Amazon Simple Storage Service (Amazon S3) bucket.
**Data Mapping and Request Validation**
1. Data transformations with mapping templates
In API Gateway, an API's method request can take a payload in a different format from the corresponding integration request payload as required by your backend and the reverse.
Mapping templates can be added to the integration request to transform the incoming request to the format required by the backend of the application or to transform the backend payload to the format required by the method response.
2. JSON to XML transformation example
![image](https://github.com/user-attachments/assets/ec1b17ed-cebc-4d23-8508-ab0153565fdb)
- Client makes a GET request to /sayHello.
- It expects a XML payload.
- Your backend only responds with JSON.
- You can create a transformation template to make it work.
**Handling errors with Gateway Responses**
For invalid requests, API Gateway bypasses the integration altogether and returns an error response. By default, the error response contains a short descriptive error message.
For some of the error responses, API Gateway allows customization by API developers to return the responses in different formats.
- Change HTTP status code.
- Modify body content.
- Add headers.
**Offloading request validation to API Gateway**
  In conjunction with data transformation and customized Gateway Responses, you can also let API Gateway handle some of your basic validations, rather than making the call or building that validation into the backend.
  In this example, the request must have a "make" value, and only the values of Tesla or Hyundai would make it to the backend.
  ![image](https://github.com/user-attachments/assets/e7010f42-74fe-41c5-a77a-c910779e1462)
  - The first request would pass because it has a make of Tesla.
  - The second would fail because it has a make but it is not one of the choices in the enumerated list.
  - The third option would fail because it doesn’t have a value for make at all.
API Gateway verifies either or both of the following conditions for you.
- The required request parameters in the URL, query string, and headers of an incoming request are included and non-blank.
**Wrap-up**
  the features and benefits API Gateway provides to your applications and architectures.
## Amazon DynamoDB for Serverless Architectures
DynamoDB is a serverless, fully managed NoSQL (non-relational) database service designed for Online Transactional Processing (OLTP) workloads.
- Flexible Schema
- JSON document or key-value data structures
- Supports event-driven programming
- Accessible via AWS Management Console, CLI, and SDK
- Availability, durabxility, and scalability built-in
- Scales horizontally
- Provides fine-grained access control
- Integrates with other AWS services
**AWS Purpose-built Database Services**
![image](https://github.com/user-attachments/assets/152d0a01-3d6f-439b-890d-02d5cba8c629)
1. **How Amazon DynamoDB Works**
   ![image](https://github.com/user-attachments/assets/3a1cb6f1-862d-4807-a886-805f1d52fcb2)
   - Tables, Items, and Partitions
   - More on Primary keys > Local secondary Key, Global Secondary key
   - Durability and Availability
   - Consistency
   - Requests Throughput
   - Streams
2. **Tables and Partitions**
In Amazon DynamoDB, data is stored in tables. A table contains items with attributes. You can think of items as rows or tuples in a relational database and attributes as columns.
![image](https://github.com/user-attachments/assets/ecaae0fa-cbfc-4186-bb39-75ed6e0b348b)
- **Item**
An item is a collection of attributes. Items are analogous to rows and attributes are analogous to columns in a relational database table.
Each attribute has a name, data type, and value. An item can have any number of attributes. Unlike a relational database, DynamoDB is not constrained by a pre-defined schema. Items in a table can have different types of attributes.
-- Key-Value Model
-- JSON Document Model
- **Partition Key**
DynamoDB stores data in partitions and divides a table's items into multiple partitions based on the partition key value.
- **Partition**
A partition is an allocation of storage for a table, backed by solid-state drives (SSDs) and automatically replicated across multiple Availability Zones within an AWS Region. Partition management is handled entirely by DynamoDB. The partition key of an item is also known as its hash attribute.
- **Sort Key**
A sort key can be defined to store all of the items with the same partition key value physically close together and order them by sort key value in the partition. It represents a one-to-many relationship based on the partition key and enables querying on the sort key attribute. The sort key of an item is also known as its range attribute.

**Two Types of Primary Keys**
A table has a primary key that uniquely identifies each item in the table. There are two types of primary keys:
- partition primary key: An item is uniquely defined by its partition key.
- partition and sort primary keys: An item is uniquely identified by the combination of its partition key and sort key.

**Read and Write Capacity Units**
You must specify read and write throughput values when you create a table. DynamoDB reserves the necessary resources to handle your throughput requirements and divides the throughput evenly among partitions.
- Read Capacity Unit (RCU)
-- The number of strongly consistent reads per second of items up to 4 KB in size.
-- 1 RCU = 1 item (4kb or less) read per second.
Note: Eventually consistent reads consume half as many RCUs as strongly consistent reads.
## Devops on AWS
      ![image](https://github.com/user-attachments/assets/118b1399-9d90-4321-af0f-a4b75a41b51b)

![image](https://github.com/user-attachments/assets/379ed819-a7be-4ba7-9a8e-59838c96d40e)

 

