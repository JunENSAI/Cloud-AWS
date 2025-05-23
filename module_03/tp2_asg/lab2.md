# Lab 2 : Déploiement d'une Application Web Scalable avec ALB et ASG 🚀⚖️

Bienvenue dans ce Lab 2 ! Nous allons mettre en pratique les concepts du Module 3 en déployant une infrastructure complète comprenant un Application Load Balancer (ALB) et un Auto Scaling Group (ASG). L'objectif est de rendre une application web (simulée par le `user_data`) accessible via un ALB, tout en s'assurant que notre application peut monter en charge et résister à la perte d'instances grâce à l'ASG.

Nous allons décortiquer le code Python utilisant CDKTF pour comprendre chaque étape de la création de cette infrastructure.

## 🌟 Architecture Cible (Simplifiée) :

1.  **Réseau** : Utilisation du VPC par défaut et de ses sous-réseaux.
2.  **Sécurité** : Un groupe de sécurité principal (avec quelques points d'attention).
3.  **Configuration des Instances** : Un Launch Template pour définir nos instances EC2.
4.  **Scalabilité et Résilience** : Un Auto Scaling Group.
5.  **Distribution du Trafic** : Un Application Load Balancer.

C'est parti pour le code !

---

## 💻 Section 1 : Le Code `main.py` Expliqué

```python
# main.py (Partie 1 - Imports et Initialisation)
from constructs import Construct
from cdktf import App, TerraformStack, TerraformOutput
from cdktf_cdktf_provider_aws.provider import AwsProvider
from cdktf_cdktf_provider_aws.instance import Instance, InstanceEbsBlockDevice # Instance EC2 individuelle (sera redondante)
from cdktf_cdktf_provider_aws.security_group import SecurityGroup, SecurityGroupIngress, SecurityGroupEgress
from cdktf_cdktf_provider_aws.default_vpc import DefaultVpc # Pour récupérer le VPC par défaut
from cdktf_cdktf_provider_aws.default_subnet import DefaultSubnet # Pour récupérer les sous-réseaux par défaut
from cdktf_cdktf_provider_aws.launch_template import LaunchTemplate # Modèle pour les instances de l'ASG
from cdktf_cdktf_provider_aws.lb import Lb # Le Load Balancer (ALB)
from cdktf_cdktf_provider_aws.lb_target_group import LbTargetGroup # Groupe cible pour l'ALB
from cdktf_cdktf_provider_aws.lb_listener import LbListener, LbListenerDefaultAction # Écouteur pour l'ALB
from cdktf_cdktf_provider_aws.autoscaling_group import AutoscalingGroup # L'Auto Scaling Group
from user_data import user_data # Notre script de démarrage pour les instances

class MyStack(TerraformStack):
    def __init__(self, scope: Construct, ns: str):
        super().__init__(scope, ns)
        AwsProvider(self, "AWS", region="us-east-1")
```

## Explications (Partie 1) :
1. Imports :
- On importe toutes les classes nécessaires de cdktf et du cdktf_cdktf_provider_aws. Chaque import correspond à un type de ressource AWS ou à une fonctionnalité CDKTF que nous allons utiliser.
- user_data est importé depuis un fichier user_data.py (non fourni ici, mais on suppose qu'il contient un script encodé en Base64 pour initialiser nos instances, par exemple installer un serveur web).
2. MyStack(TerraformStack) :
- Définit notre stack Terraform, qui est le conteneur pour toutes les ressources AWS que nous allons créer.
- AwsProvider(self, "AWS", region="us-east-1") : Configure le fournisseur AWS pour qu'il opère dans la région us-east-1. Toutes les ressources seront créées dans cette région.

```python

# main.py (Partie 2 - Réseau et Groupe de Sécurité)
        # Récupération du VPC par défaut et de ses sous-réseaux
        default_vpc = DefaultVpc(
            self, "default_vpc"
        )
         
        # Les AZ de us-east-1 sont de la forme us-east-1x 
        # avec x une lettre dans abcdef.
        # Ceci est spécifique à us-east-1 et nécessiterait une adaptation pour d'autres régions.
        az_ids = [f"us-east-1{i}" for i in "abcdef"] # Crée une liste comme ['us-east-1a', 'us-east-1b', ...]
        subnets= []
        for i,az_id in enumerate(az_ids):
            subnets.append(DefaultSubnet(
                self, f"default_sub{i}", # ID logique unique pour chaque ressource DefaultSubnet
                availability_zone=az_id  # Spécifie l'AZ pour ce sous-réseau par défaut
            ).id) # Ajoute l'ID du sous-réseau à la liste `subnets`

        # Groupe de Sécurité (un seul pour tout le monde dans cet exemple)
        security_group = SecurityGroup(
            self, "sg-tp",
            vpc_id=default_vpc.id, # Important: Associer le SG au VPC
            ingress=[ # Règles ENTRANTES
                SecurityGroupIngress( # Autorise SSH
                    from_port=22,
                    to_port=22,
                    cidr_blocks=["0.0.0.0/0"], # DEPUIS N'IMPORTE QUELLE IP ⚠️ (Pour le lab)
                    protocol="TCP",
                ),
                SecurityGroupIngress( # Autorise HTTP
                    from_port=80,
                    to_port=80,
                    cidr_blocks=["0.0.0.0/0"], # DEPUIS N'IMPORTE QUELLE IP 🌐 (Pour l'accès à l'ALB)
                    protocol="TCP"
                )
            ],
            egress=[ # Règles SORTANTES
                SecurityGroupEgress( # Autorise tout trafic sortant
                    from_port=0,
                    to_port=0,
                    cidr_blocks=["0.0.0.0/0"],
                    protocol="-1" # Tous protocoles
                )
            ]
        )
```

## Explications (Partie 2) :
1. default_vpc = DefaultVpc(...) ☁️:
- Récupère des informations sur le VPC par défaut de votre compte AWS dans la région configurée. Cela évite d'avoir à créer un nouveau VPC pour ce lab. L'ID de ce VPC sera utilisé pour d'autres ressources.
2. Récupération des Sous-réseaux (subnets) 🌐:
- az_ids = [f"us-east-1{i}" for i in "abcdef"]: Crée une liste des noms de Zones de Disponibilité (AZ) typiques pour us-east-1.
- La boucle for itère sur ces az_ids. Pour chaque AZ, DefaultSubnet(...) tente de récupérer l'ID du sous-réseau par défaut dans cette AZ spécifique.
- Tous ces IDs de sous-réseaux sont stockés dans la liste subnets. Ces sous-réseaux seront utilisés pour déployer notre ALB et les instances de l'ASG, leur permettant d'être répartis sur plusieurs AZ pour la haute disponibilité.
- **Note importante** : Cette méthode pour obtenir les sous-réseaux est un peu rigide et spécifique à us-east-1. Une approche plus robuste utiliserait des Data Sources pour lister les sous-réseaux disponibles sans coder en dur les noms d'AZ.
3. security_group = SecurityGroup(...) 🔥🧱:
- Crée un Groupe de Sécurité.
- vpc_id=default_vpc.id: Crucial, ce SG est créé à l'intérieur du VPC par défaut.
- ingress: Définit les règles pour le trafic entrant :
    - Port 22 (SSH) ouvert à 0.0.0.0/0 (tout Internet). Utile pour le débogage, mais non recommandé en production.
    - Port 80 (HTTP) ouvert à 0.0.0.0/0. Cela permettra à Internet d'atteindre notre ALB.
- egress: Autorise tout trafic sortant.
- Point d'attention critique : Ce seul groupe de sécurité sera utilisé à la fois pour l'ALB et pour les instances EC2 du Launch Template.
    - Pour l'ALB, l'ouverture du port 80 à 0.0.0.0/0 est correcte.
    - Pour les instances EC2, il serait préférable d'avoir un SG dédié qui n'autorise le port 80/8080 que depuis le SG de l'ALB, et le port 22 que depuis votre IP. Utiliser un seul SG comme ceci est moins sécurisé.

```python

# main.py (Partie 3 - Instance EC2 individuelle et Launch Template)

        # Instance EC2 individuelle (comme vue en TP1) - Probablement redondante/non utilisée par l'ALB/ASG
        instance = Instance(self, "compute",
                            ami="ami-04b4f1a9cf54c11d0", # AMI Ubuntu 22.04 pour us-east-1
                            instance_type="t2.micro",
                            # Il manque l'association du security_group et potentiellement user_data ici
                            # pour que cette instance soit configurée et accessible comme prévu.
                            ebs_block_device= [InstanceEbsBlockDevice(
                                device_name="/dev/sda1",
                                delete_on_termination=True,
                                encrypted=False,
                                volume_size=20,
                                volume_type="gp2"
                            )],
        )
        TerraformOutput(self, "public_ip", # Output pour l'IP de cette instance individuelle
                        value=instance.public_ip,
        )
        
        # Launch Template pour l'Auto Scaling Group
        launch_template = LaunchTemplate(
            self, "launch template",
            image_id="ami-04b4f1a9cf54c11d0", # Même AMI Ubuntu
            instance_type="t2.micro",
            # Ici, le security_group créé précédemment est correctement associé.
            vpc_security_group_ids=[security_group.id], 
            key_name="vockey", # Nom d'une paire de clés SSH existante dans votre compte AWS. 🔑
                              # Assurez-vous que "vockey" existe bien dans us-east-1 ou retirez cette ligne si non gérée.
            user_data=user_data, # Script de démarrage importé (ex: pour installer un serveur web)
            name="template_TF" # Nom du Launch Template dans AWS
        )
```

## Explications (Partie 3) :
1. instance = Instance(...) 💻:
- Ce bloc crée une instance EC2 unique et autonome, similaire à ce qui aurait pu être fait dans un TP précédent.
- Elle utilise une AMI Ubuntu, un type t2.micro, et configure son volume racine.
- Points d'attention :
    - Cette instance n'est pas associée au security_group que nous avons défini plus haut (l'argument security_groups ou vpc_security_group_ids manque).
    - Elle n'est pas explicitement liée à l'ALB ou à l'ASG. Elle vivra sa vie de son côté.
    - Si elle est censée faire partie de l'architecture ALB/ASG, elle est redondante car l'ASG lancera ses propres instances basées sur le LaunchTemplate.
    - L'output public_ip est pour cette instance isolée.
2. launch_template = LaunchTemplate(...) 📝:
- C'est le modèle que l'Auto Scaling Group utilisera pour créer de nouvelles instances EC2.
- image_id et instance_type : Similaires à l'instance individuelle.
- vpc_security_group_ids=[security_group.id] : Correct ! Les instances lancées par l'ASG utiliseront le security_group que nous avons défini (avec les ports 22 et 80 ouverts à tous).
- key_name="vockey" : Spécifie que les instances doivent être lancées avec la paire de clés SSH nommée "vockey". Cette paire de clés doit exister au préalable dans votre compte AWS dans la région us-east-1. Si ce n'est pas le cas, le déploiement échouera ou les instances ne seront pas accessibles via SSH avec cette clé. Pour un lab, il est souvent plus simple de ne pas spécifier de key_name si l'accès SSH direct n'est pas un impératif ou si la gestion des clés n'est pas le focus.
- user_data=user_data : Crucial ! C'est ici que l'on passe le script qui sera exécuté au démarrage de chaque instance lancée par l'ASG (par exemple, pour installer Apache/Nginx et une page index.html).
- name="template_TF" : Donne un nom à la ressource Launch Template dans AWS.

```python
# main.py (Partie 4 - Target Group et Auto Scaling Group)

        # Définition du Target Group pour le Load Balancer
        target_group=LbTargetGroup(
            self, "tg_group", # ID logique CDKTF
            port=8080,          # Port sur lequel les instances écoutent 🎯
            protocol="HTTP",
            vpc_id=default_vpc.id, # Associé à notre VPC par défaut
            target_type="instance", # Les cibles sont des instances EC2
            # Health Check (Vérification de l'état de santé) utilise les valeurs par défaut.
            # Il serait bon de spécifier le path (ex: "/index.html") et potentiellement le port ici.
        )
        
        # Définition de l'Auto Scaling Group (ASG)
        asg = AutoscalingGroup(
            self, "asg", # ID logique CDKTF
            min_size=2,                             # Nombre minimum d'instances
            max_size=4,                             # Nombre maximum d'instances
            desired_capacity=2,                     # Nombre d'instances souhaité au démarrage
            launch_template={"id": launch_template.id}, # Utilise le Launch Template défini plus haut
            vpc_zone_identifier=subnets,            # Déploie les instances dans les sous-réseaux récupérés
            target_group_arns=[target_group.arn]    # 🔗 Lie l'ASG au Target Group !
                                                    # Les instances lancées par l'ASG seront automatiquement
                                                    # enregistrées (et désenregistrées) auprès de ce Target Group.
        )
```

## Explications (Partie 4) :
1. target_group = LbTargetGroup(...) 🎯:
- Crée un Groupe Cible pour notre Load Balancer. C'est vers ce groupe que l'ALB enverra le trafic.
- port=8080 : Important ! Cela signifie que le Target Group s'attend à ce que les instances EC2 (lancées par l'ASG) aient leur application web (par exemple, le serveur web configuré par user_data) écoutant sur le port 8080.
- protocol="HTTP" et target_type="instance" : Classique.
- vpc_id=default_vpc.id : Le TG est dans notre VPC.
- Health Check : Les vérifications de l'état de santé utiliseront les valeurs par défaut du Target Group. Pour une application web, il est fortement recommandé de configurer le health_check avec un path (ex: / ou /index.html) et de s'assurer que le port correspond bien à celui de l'application sur les instances (ici 8080). Si le health check échoue, l'ALB ne dirigera pas de trafic vers l'instance.
2. asg = AutoscalingGroup(...) ⚖️🚀:
- Crée l'Auto Scaling Group.
- min_size=2, max_size=4, desired_capacity=2 : Configure la taille du groupe. Il démarrera avec 2 instances, pourra monter à 4 si nécessaire (nécessiterait des politiques de scaling non définies ici), et ne descendra pas en dessous de 2.
- launch_template={"id": launch_template.id} : Indique à l'ASG d'utiliser notre launch_template pour créer de nouvelles instances.
- vpc_zone_identifier=subnets : Spécifie la liste des IDs de sous-réseaux dans lesquels l'ASG peut lancer des instances. Cela permet une répartition sur plusieurs AZ.
- target_group_arns=[target_group.arn] : Lien crucial ! Cela indique à l'ASG d'enregistrer automatiquement toutes les instances qu'il lance auprès du target_group que nous avons créé. Ainsi, l'ALB sera au courant de ces instances.

```python
# main.py (Partie 5 - Load Balancer, Listener et Outputs)

	    # Définition du Load Balancer (Application Load Balancer)
        lb = Lb(
            self, "lb", # ID logique CDKTF
            load_balancer_type="application", # Type ALB
            security_groups=[security_group.id], # Utilise le même SG que les instances. 🛡️
                                                # Le port 80 doit être ouvert sur ce SG.
            subnets=subnets, # Déploie l'ALB sur les sous-réseaux spécifiés
            internal=False # Crée un ALB public (accessible depuis Internet) par défaut
        )

        # Définition du Listener pour l'ALB
        lb_listener = LbListener(
            self, "lb_listener", # ID logique CDKTF
            load_balancer_arn=lb.arn, # Lie ce listener à l'ALB créé
            port=80,                  # L'ALB écoute sur le port 80 (HTTP) 👂
            protocol="HTTP",
            # Action par défaut : transférer le trafic vers le Target Group
            default_action=[LbListenerDefaultAction(
                type="forward",
                target_group_arn=target_group.arn
            )] 
        )

        # Output pour le nom DNS de l'ALB
        TerraformOutput(self, "alb_dns_name",
                        value=lb.dns_name,
                        description="DNS name of the Application Load Balancer" # "Language test" était peut-être une typo
                        )

# Initialisation et Synthèse de l'application CDKTF
app = App()
MyStack(app, "tp2_asg") # Nom de la stack Terraform

app.synth() # Génère le fichier cdk.tf.json

```

## Explications (Partie 5) :

1. lb = Lb(...) 🚦:
- Crée l'Application Load Balancer (ALB).
- load_balancer_type="application" : Spécifie que c'est un ALB.
- security_groups=[security_group.id] : L'ALB utilisera le security_group existant. Ce SG doit autoriser le trafic entrant sur le port du listener (ici, port 80) depuis 0.0.0.0/0 pour être accessible publiquement.
- subnets=subnets : L'ALB sera déployé à travers les sous-réseaux spécifiés, lui permettant d'être hautement disponible. Ces doivent être des sous-réseaux publics si l'ALB est public.
- internal=False est la valeur par défaut, ce qui signifie qu'il sera un ALB accessible depuis Internet (il obtiendra une IP publique).
2. lb_listener = LbListener(...) 👂:
- Crée un Listener pour notre ALB.
- load_balancer_arn=lb.arn : Attache ce listener à l'ALB que nous venons de créer.
- port=80, protocol="HTTP" : L'ALB écoutera les requêtes HTTP entrantes sur le port 80.
- default_action=[...] : Définit ce que le listener doit faire avec le trafic reçu.
- type="forward" : Il va transférer (forward) le trafic.
- target_group_arn=target_group.arn : Le trafic sera transféré vers le target_group que nous avons configuré (qui s'attend à ce que les instances écoutent sur le port 8080).
- TerraformOutput(self, "alb_dns_name", ...) 🌐:
- Après le déploiement, Terraform affichera le nom DNS public de l'ALB. C'est cette URL que vous utiliserez dans votre navigateur pour accéder à l'application.
3. Fin du Script (App(), MyStack(), app.synth()) ✨:
- Initialise l'application CDKTF.
- Instancie notre MyStack en lui donnant le nom "tp2_asg" (ce sera le nom de la stack dans Terraform).
- app.synth() : La commande magique qui convertit tout ce code Python en un fichier cdk.tf.json que la CLI Terraform peut comprendre et utiliser pour déployer l'infrastructure sur AWS.

