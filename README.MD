# AWS CloudFormation Template for VPC

## Description

This CloudFormation template deploys a Virtual Private Cloud (VPC) with 2 public and 2 private subnets spread across two Availability Zones. It also creates an internet gateway, a set of route tables, and security groups to control access. The resources are tagged with an environment name for easy identification.

## Template Details

### Metadata

The Metadata section defines parameter groups for organizing the input parameters in the AWS Management Console.

### Parameters

Parameters define the input parameters in the CloudFormation template, allowing the user to provide custom values when creating a stack.

- **VpcCIDR**, **PublicSubnet1CIDR**, **PublicSubnet2CIDR**, **PrivateSubnet1CIDR**, and **PrivateSubnet2CIDR**: These are the IP address ranges that define the VPC and subnets.
- **SSHIP**: This parameter defines the range of IP addresses that are allowed to access the web server via SSH.

### Resources

The Resources section is the core part of the CloudFormation template and defines all AWS resources to be created. Each resource consists of a unique logical name and a type (e.g., `AWS::EC2::VPC`) with its corresponding properties.

- **Student474218390VPC**: Creates a VPC with the specified CIDR block.
- **InternetGateway**: Creates an internet gateway.
- **InternetGatewayAttachment**: Attaches the internet gateway to the VPC.
- **PublicSubnet1**: Creates the first public subnet in the VPC.
- **PublicSubnet2**: Creates the second public subnet in the VPC.
- **PrivateSubnet1**: Creates the first private subnet in the VPC.
- **PrivateSubnet2**: Creates the second private subnet in the VPC.
- **PublicRouteTable**: Creates a route table for the public subnets.
  - **DefaultPublicRoute**: Adds a route to the public route table that directs internet traffic to the internet gateway.
  - **PublicSubnet1RouteTableAssociation**: Associates the first public subnet with the public route table.
  - **PublicSubnet2RouteTableAssociation**: Associates the second public subnet with the public route table.
- **PrivateRouteTable1**: Creates a route table for the private subnets.
  - **PrivateSubnet1RouteTableAssociation**: Associates the first private subnet with the private route table.
  - **PrivateSubnet2RouteTableAssociation**: Associates the second private subnet with the private route table.
- **SSHSecurityGroup**: Defines a security group to allow SSH access.
- **HTTPSecurityGroup**: Defines a security group to allow HTTP and SSH access.
- **WebServerSG**: Defines a security group to allow web server access on ports 80 and 22.
- **DataBaseSG**: Defines a security group to allow database access.

## How to Deploy

To deploy the CloudFormation stack, follow these steps:

1. **Log in to the AWS Console**

   Access the AWS Management Console and log in using your account credentials.

2. **Navigate to CloudFormation**

   Go to the CloudFormation service in the AWS Management Console.

3. **Create a New Stack**

   Click on "Create stack" and choose "With new resources (standard)".

4. **Upload the Template**

   Upload the `vpc-with-cloudformation.yml` file from this repository.

5. **Specify Stack Details**

   Enter a stack name and provide the necessary parameter values.

6. **Review and Create**

   Review the stack details and click "Create stack" to deploy.

## Outputs

The output section provides resource IDs including VPC ID, public subnet, private subnet, and security group, to facilitate referencing these resources in other stacks. Other stacks can import these resources.
