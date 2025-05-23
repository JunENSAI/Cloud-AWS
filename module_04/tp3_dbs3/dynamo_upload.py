import json
import boto3

# Configuration
DYNAMODB_TABLE_NAME = 'JuniorDB'
USERS_JSON_FILE_PATH = 'users.json'
AWS_REGION = 'us-east-1'

# Initialisation du client DynamoDB
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
table = dynamodb.Table(DYNAMODB_TABLE_NAME)

try:
    with open(USERS_JSON_FILE_PATH, 'r') as f:
        users_data = json.load(f) 
except FileNotFoundError:
    print(f"Erreur : Le fichier '{USERS_JSON_FILE_PATH}' n'a pas été trouvé.")
    exit()
except json.JSONDecodeError as e:
    print(f"Erreur de décodage JSON dans le fichier '{USERS_JSON_FILE_PATH}': {e}")
    exit()

if not isinstance(users_data, list):
    print(f"Erreur : Le contenu de '{USERS_JSON_FILE_PATH}' n'est pas une liste JSON valide.")
    exit()

print(f"Début du chargement de {len(users_data)} utilisateurs dans la table '{DYNAMODB_TABLE_NAME}'...")

try:
    with table.batch_writer() as batch:
        for user_item in users_data:
            if isinstance(user_item, dict):
                batch.put_item(Item=user_item)
            else:
                print(f"Attention : Ignorer un élément non-dictionnaire dans le fichier JSON : {user_item}")
    print(f"Chargement terminé. {len(users_data)} items traités.")
except Exception as e:
    print(f"Une erreur est survenue lors de l'écriture dans DynamoDB : {e}")