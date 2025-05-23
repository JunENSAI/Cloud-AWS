# Lab 3 : Exploration du Code d'Infrastructure pour S3 et DynamoDB 🕵️‍♂️⚙️🐍

Dans ce lab, nous allons décortiquer le code Python (utilisant CDKTF) qui a été utilisé pour créer notre infrastructure de stockage pour le TP3 : un bucket S3 et une table DynamoDB. Comprendre ce code est essentiel pour maîtriser la définition d'infrastructure en tant que code.

**Fichier concerné : `main.py` (du projet CDKTF `tp3_dbs3`)**

---

## 📜 Code Source (`main.py`) :

```python
from constructs import Construct
from cdktf import App, TerraformStack, TerraformOutput
from cdktf_cdktf_provider_aws.provider import AwsProvider
from cdktf_cdktf_provider_aws.data_aws_caller_identity import DataAwsCallerIdentity # Importation pour récupérer l'ID de compte
from cdktf_cdktf_provider_aws.s3_bucket import S3Bucket
from cdktf_cdktf_provider_aws.s3_bucket_cors_configuration import S3BucketCorsConfiguration, S3BucketCorsConfigurationCorsRule # Importations pour CORS
from cdktf_cdktf_provider_aws.dynamodb_table import DynamodbTable, DynamodbTableAttribute

class MyStack(TerraformStack):
    def __init__(self, scope: Construct, id: str):
        super().__init__(scope, id)
        
        # 1. Configuration du Fournisseur AWS ☁️
        AwsProvider(self, "AWS", region="us-east-1")

        
        # 2. Création du Bucket S3 🗄️
        bucket = S3Bucket(
            self, "bucket", # ID logique CDKTF pour cette ressource
            bucket_prefix="jr-bucket" # Préfixe pour le nom du bucket
                                                # S3 ajoutera un suffixe aléatoire pour l'unicité globale.
        )

        # 3. Configuration CORS pour le Bucket S3 (Cross-Origin Resource Sharing) 🌐🔗
        S3BucketCorsConfiguration(
            self, "cors", # ID logique CDKTF
            bucket=bucket.id, # Associe cette config au bucket créé précédemment
            cors_rule=[S3BucketCorsConfigurationCorsRule( # Définit une règle CORS
                allowed_headers=["*"],       # Autorise tous les en-têtes
                allowed_methods=["GET", "HEAD", "PUT"], # Autorise ces méthodes HTTP
                allowed_origins=["*"]        # Autorise les requêtes depuis n'importe quelle origine ⚠️
            )]
        )
        
        # 4. Création de la Table DynamoDB 🍽️📊
        dynamo_table = DynamodbTable(
            self, "DynamodDB-table", # ID logique CDKTF
            name="JuniorDB",          # Nom de la table DynamoDB
            hash_key="user_id",       # Attribut pour la clé de partition (Partition Key)
            range_key="email",        # Attribut pour la clé de tri (Sort Key)
            
            attribute=[ # Définition des attributs qui composent les clés
                DynamodbTableAttribute(name="user_id", type="S"), # 'S' pour String
                DynamodbTableAttribute(name="email", type="S"),
            ],
            
            billing_mode="PROVISIONED", # Mode de facturation : capacité provisionnée
            read_capacity=5,            # Unités de capacité de lecture provisionnées
            write_capacity=5            # Unités de capacité d'écriture provisionnées
        )
        
        # 5. Définition des Outputs Terraform 📤
        TerraformOutput(
            self, "table_name_output",
            value=dynamo_table.name,
            description="premier dynamoDB"
        )

        TerraformOutput(
            self, "bucket_name_output",
            value=bucket.bucket, # Note: bucket.bucket donne le nom complet du bucket
            description="premier stockage"
        )

# Initialisation et Synthèse de l'Application CDKTF
app = App()
MyStack(app, "tp3_dbs3") # Nom de la Stack Terraform
app.synth()
```

## Classe MyStack(TerraformStack)  :

C'est la classe principale où nous déclarons toutes les ressources de notre infrastructure pour ce TP.

1. AwsProvider(self, "AWS", region="us-east-1") ☁️
- Configure le fournisseur AWS pour cette stack.
- region="us-east-1": Indique que toutes les ressources (sauf celles qui sont globales comme IAM ou certains aspects de S3) seront créées dans la région us-east-1.


2. bucket = S3Bucket(...) 🗄️
- Crée une instance de la ressource S3Bucket.
- self, "bucket": L'ID logique pour CDKTF. Ce n'est pas le nom du bucket.
- bucket_prefix="jr-bucket": Au lieu de définir un nom de bucket exact (qui doit être globalement unique et pourrait déjà être pris), bucket_prefix demande à AWS de créer un nom qui commence par "my-cdtf-test-bucket-" et d'y ajouter un suffixe aléatoire pour garantir l'unicité. C'est une bonne pratique pour les labs et les tests.
4. S3BucketCorsConfiguration(...) 🌐🔗
- Configure les règles CORS (Cross-Origin Resource Sharing) pour le bucket S3 créé juste avant.
- bucket=bucket.id: Lie cette configuration CORS au bucket spécifique bucket en utilisant son ID (attribut id de l'objet bucket).
- cors_rule=[S3BucketCorsConfigurationCorsRule(...)]: Définit une liste de règles CORS. Ici, une seule règle est définie :
    - allowed_headers=["*"]: Autorise tous les en-têtes HTTP dans les requêtes cross-origin.
    - allowed_methods=["GET", "HEAD", "PUT"]: Autorise les requêtes cross-origin utilisant ces méthodes HTTP (ex: un script sur domaineA.com peut faire un PUT sur le bucket hébergé sur domaineS3.com).
    - allowed_origins=["*"]: ATTENTION SÉCURITÉ ⚠️ : Autorise les requêtes cross-origin depuis n'importe quelle origine (n'importe quel site web). Pour la production, vous devriez restreindre cela aux domaines spécifiques qui ont besoin d'accéder à votre bucket.
5. dynamo_table = DynamodbTable(...) 🍽️📊
- Crée une instance de la ressource DynamodbTable.
- name="JuniorDB": C'est le nom réel de la table DynamoDB qui sera créée dans AWS.
- hash_key="user_id": Définit l'attribut user_id comme clé de partition (HASH key). C'est l'identifiant principal pour localiser un item.
- range_key="email": Définit l'attribut email comme clé de tri (RANGE key). Au sein d'une même clé de partition (user_id), les items seront triés et uniquement identifiés par leur email. Cela signifie que vous pouvez avoir plusieurs items avec le même user_id tant que leur email est différent.
- attribute=[...]: Définit les types des attributs utilisés dans les clés (primaire, de tri, et pour les futurs index).
    - DynamodbTableAttribute(name="user_id", type="S"): L'attribut user_id est de type S (String).
    - DynamodbTableAttribute(name="email", type="S"): L'attribut email est aussi de type S (String).
- billing_mode="PROVISIONED": Indique que nous allons provisionner manuellement la capacité de lecture/écriture. L'alternative est "PAY_PER_REQUEST" (On-Demand), souvent plus simple pour les labs.
- read_capacity=5: Alloue 5 unités de capacité de lecture.
- write_capacity=5: Alloue 5 unités de capacité d'écriture.
6. TerraformOutput(...) 📤
- Ces blocs définissent des valeurs qui seront affichées en sortie après un cdktf deploy (ou terraform apply). C'est très utile pour récupérer des informations importantes sur les ressources créées, comme les noms ou les ARN.
- TerraformOutput(self, "table_name_output", value=dynamo_table.name, ...): Affiche le nom de la table DynamoDB.
- TerraformOutput(self, "bucket_name_output", value=bucket.bucket, ...): Affiche le nom complet et unique du bucket S3 (généré avec le préfixe).