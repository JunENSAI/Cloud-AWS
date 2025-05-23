import boto3
from botocore.config import Config
from os import walk
import os 


bucket = "my-cdtf-test-bucket20250523145910962800000001"



s3 = boto3.resource('s3')

print(f"Téléversement des fichiers du dossier 's3' vers le bucket '{bucket}'...")
for dirpath, dirnames, filenames in walk("s3"):
    if filenames:
        local_file_path = os.path.join(dirpath, filenames[0])
        s3_key = "/".join(dirpath.split(os.sep)[1:]) + "/" + filenames[0]
        if not s3_key.startswith('/'):
            print(f"  -> Téléversement de '{local_file_path}' vers 's3://{bucket}/{s3_key}'")
            try:
                with open(local_file_path, 'rb') as file_body:
                    s3.Object(bucket, s3_key).put(Body=file_body)
            except Exception as e:
                print(f"  ERREUR lors du téléversement de {local_file_path}: {e}")
        else:
             print(f"  Ignoré: Fichier directement dans le dossier racine 's3': {local_file_path}")