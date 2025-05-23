from constructs import Construct
from cdktf import App, TerraformStack, TerraformOutput
from cdktf_cdktf_provider_aws.provider import AwsProvider
from cdktf_cdktf_provider_aws.instance import Instance, InstanceEbsBlockDevice
from cdktf_cdktf_provider_aws.security_group import SecurityGroup, SecurityGroupIngress, SecurityGroupEgress
from cdktf_cdktf_provider_aws.default_vpc import DefaultVpc
from cdktf_cdktf_provider_aws.default_subnet import DefaultSubnet
from cdktf_cdktf_provider_aws.launch_template import LaunchTemplate
from cdktf_cdktf_provider_aws.lb import Lb
from cdktf_cdktf_provider_aws.lb_target_group import LbTargetGroup
from cdktf_cdktf_provider_aws.lb_listener import LbListener, LbListenerDefaultAction
from cdktf_cdktf_provider_aws.autoscaling_attachment import AutoscalingAttachment
from cdktf_cdktf_provider_aws.autoscaling_group import AutoscalingGroup, AutoscalingGroupLaunchTemplate
from user_data import user_data

class MyStack(TerraformStack):
    def __init__(self, scope: Construct, ns: str):
        super().__init__(scope, ns)
        AwsProvider(self, "AWS", region="us-east-1")
        #security group pour gérer les permissions de sécurité
        default_vpc = DefaultVpc(
            self, "default_vpc"
        )
         
        # Les AZ de us-east-1 sont de la forme us-east-1x 
        # avec x une lettre dans abcdef. Ne permet pas de déployer
        # automatiquement ce code sur une autre région. Le code
        # pour y arriver est vraiment compliqué.
        az_ids = [f"us-east-1{i}" for i in "abcdef"]
        subnets= []
        for i,az_id in enumerate(az_ids):
            subnets.append(DefaultSubnet(
            self, f"default_sub{i}",
            availability_zone=az_id
        ).id)

        security_group = SecurityGroup(
            self, "sg-tp",
            ingress=[
                SecurityGroupIngress(
                    from_port=22,
                    to_port=22,
                    cidr_blocks=["0.0.0.0/0"],
                    protocol="TCP",
                ),
                SecurityGroupIngress(
                    from_port=80,
                    to_port=80,
                    cidr_blocks=["0.0.0.0/0"],
                    protocol="TCP"
                )
            ],
            egress=[
                SecurityGroupEgress(
                    from_port=0,
                    to_port=0,
                    cidr_blocks=["0.0.0.0/0"],
                    protocol="-1"
                )
            ]
            )
        #instance EC2 comme vu en tp1
        instance = Instance(self, "compute",
                            ami="ami-04b4f1a9cf54c11d0",
                            instance_type="t2.micro",
                            ebs_block_device= [InstanceEbsBlockDevice(
                            device_name="/dev/sda1",
                            delete_on_termination=True,
                            encrypted=False,
                            volume_size=20,
                            volume_type="gp2"
                            )],)
        TerraformOutput(self, "public_ip",
                        value=instance.public_ip,
                        )
        
        launch_template = LaunchTemplate(
            self, "launch template",
            image_id="ami-04b4f1a9cf54c11d0", 
            instance_type="t2.micro" ,
            vpc_security_group_ids =[security_group.id]  ,
            key_name="vockey", 
            user_data=user_data,
            name="template_TF"
            )
        
        # définition du target group du LB
        target_group=LbTargetGroup(
            self, "tg_group",
            port=8080,
            protocol="HTTP" ,
            vpc_id=default_vpc.id ,
            target_type="instance",
            health_check={
                "enabled": True,
                "path": "/docs",
                "port": "8080",
                "protocol": "HTTP",
                "interval": 30,
                "timeout": 5,
                "unhealthy_threshold": 2,
                "matcher": "200-399" 
            }
        )

        
        # défintion du ASG
        asg = AutoscalingGroup(
            self, "asg",
            min_size=2,
            max_size=4, 
            desired_capacity=2,
            launch_template={"id": launch_template.id},
            vpc_zone_identifier=subnets ,
            target_group_arns=[target_group.arn] 
        )

	    # définition du load balancer
        lb = Lb(
            self, "lb",
            load_balancer_type="application" ,
            security_groups=[security_group.id],
            subnets=subnets 
        )


        lb_listener = LbListener(
            self, "lb_listener",
            load_balancer_arn=lb.arn, 
            port=80,
            protocol="HTTP",
            default_action=[LbListenerDefaultAction(type="forward", target_group_arn=target_group.arn)] 
        )



app = App()
MyStack(app, "tp2_asg")

app.synth()
