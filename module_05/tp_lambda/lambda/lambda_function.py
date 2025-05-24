import json
import os
import boto3

sqs = boto3.client('sqs')
output_queue_url = os.environ.get('OUTPUT_QUEUE_URL')


def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))

    if not output_queue_url:
        return {'statusCode': 500, 'body': 'Erreur de configuration : OUTPUT_QUEUE_URL manquant.'}

    for record in event.get('Records', []):
        try:
            message_body = record.get('body')
            if not message_body:
                print("Message SQS sans corps (body), passage au suivant.")
                continue

            print(f"Processing message body string: {message_body}")
            message_data = json.loads(message_body)

            num1 = message_data.get('number1')
            num2 = message_data.get('number2')
            operation = message_data.get('operation')

            if num1 is None or num2 is None or operation is None:
                 print(f"Données manquantes dans le message : {message_data}")
                 continue

            try:
                num1 = float(num1)
                num2 = float(num2)
            except ValueError:
                print(f"Impossible de convertir les nombres : num1={num1}, num2={num2}")
                continue

            result = None
            if operation == '+':
                result = num1 + num2
            elif operation == '-':
                result = num1 - num2
            elif operation == '*':
                result = num1 * num2
            elif operation == '/':
                if num2 == 0:
                    print("Erreur : Division par zéro")
                    result_json= {"statusCode": 400, "error": "Division par zero"}
                else:
                    result = num1 / num2
            else:
                print(f"Opération non prise en charge : {operation}")
                result_json = {"statusCode": 400, "error": f"Unsupported operation: {operation}"}


            if result is not None:
                 result_json = {
                     "statusCode": 200,
                     "result": result
                 }
                 print(f"Résultat de l'opération : {result}")
            print(f"Envoi du message à la file de sortie: {output_queue_url}")
            sqs.send_message(
                QueueUrl=output_queue_url,
                MessageBody=json.dumps(result_json)
            )
            print("Message envoyé avec succès à la file de sortie.")

        except json.JSONDecodeError:
            print(f"Erreur de décodage JSON pour le corps: {message_body}")
        except Exception as e:
            print(f"Erreur inattendue lors du traitement du message {record.get('messageId', 'N/A')}: {e}")
    return {
        'statusCode': 200,
        'body': json.dumps('Traitement des messages terminé.')
    }