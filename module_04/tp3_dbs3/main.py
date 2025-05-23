#!/usr/bin/env python
from constructs import Construct
from cdktf import App, TerraformStack, TerraformOutput
from cdktf_cdktf_provider_aws.provider import AwsProvider
from cdktf_cdktf_provider_aws.s3_bucket import S3Bucket
from cdktf_cdktf_provider_aws.s3_bucket_cors_configuration import S3BucketCorsConfiguration,S3BucketCorsConfigurationCorsRule
from cdktf_cdktf_provider_aws.dynamodb_table import DynamodbTable, DynamodbTableAttribute

class MyStack(TerraformStack):
    def __init__(self, scope: Construct, id: str):
        super().__init__(scope, id)
        AwsProvider(self, "AWS", region="us-east-1")

        
        bucket = S3Bucket(
            self, "bucket",
            bucket_prefix="jr-bucket"
        )

        S3BucketCorsConfiguration(
            self, "cors",
            bucket=bucket.id,
            cors_rule=[S3BucketCorsConfigurationCorsRule(
                allowed_headers = ["*"],
                allowed_methods = ["GET", "HEAD", "PUT"],
                allowed_origins = ["*"]
            )]
            )
        dynamo_table = DynamodbTable(
            self, "DynamodDB-table",
            name= "JuniorDB",
            hash_key="user_id",
            range_key="email",
            attribute=[
                DynamodbTableAttribute(name="user_id",type="S" ),
                DynamodbTableAttribute(name="email",type="S" ),
            ],
            billing_mode="PROVISIONED",
            read_capacity=5,
            write_capacity=5
        )
        TerraformOutput(
            self, "table_name_output",
            value=dynamo_table.name,
            description="premier dynamoDB"
        )

        TerraformOutput(
            self, "bucket_name_output",
            value=bucket.bucket, 
            description="premier stockage"
        )



app = App()
MyStack(app, "tp3_dbs3")

app.synth()
