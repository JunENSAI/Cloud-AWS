#!/usr/bin/env python
from constructs import Construct
from cdktf import App, TerraformStack, TerraformAsset, AssetType
from cdktf_cdktf_provider_aws.provider import AwsProvider
from cdktf_cdktf_provider_aws.data_aws_caller_identity import DataAwsCallerIdentity
from cdktf_cdktf_provider_aws.lambda_function import LambdaFunction
from cdktf_cdktf_provider_aws.sqs_queue import SqsQueue
from cdktf_cdktf_provider_aws.lambda_event_source_mapping import LambdaEventSourceMapping

class MyStack(TerraformStack):
    def __init__(self, scope: Construct, id: str):
        super().__init__(scope, id)

        provider = AwsProvider(self, "AWS", region="us-east-1")


        caller_identity = DataAwsCallerIdentity(self, "CurrentIdentity")
        
        # --- Files SQS ---
        input_queue = SqsQueue(
            self,
            "InputQueue",
            name="calculatrice-input-queue",
            visibility_timeout_seconds=60
        )

        output_queue = SqsQueue(
            self,
            "OutputQueue",
            name="calculatrice-output-queue",
        )

        # --- Code Lambda ---
        code = TerraformAsset(
            self, "code",
            path="./lambda_deployment.zip",
            type=AssetType.FILE
        )

        # --- Fonction Lambda ---
        calculette = LambdaFunction(
            self,
            "CalculatorLambda",
            function_name="calculatrice",
            runtime="python3.9",
            memory_size=128,
            timeout=30,
            handler="lambda_function.lambda_handler",
            source_code_hash=code.asset_hash,
            filename=code.path,
            role=f"arn:aws:iam::{caller_identity.account_id}:role/LabRole",
            environment={
                "variables": {
                    "OUTPUT_QUEUE_URL": output_queue.url
                }
            },
            depends_on=[input_queue, output_queue]
        )

        # Link SQS as Lambda's source
        LambdaEventSourceMapping(
            self, "event_source_mapping",
            event_source_arn=input_queue.arn,
            function_name=calculette.arn
        )

app = App()
MyStack(app, "tp_lambda")

app.synth()
