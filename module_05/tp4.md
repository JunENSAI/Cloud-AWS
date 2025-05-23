# TP 4 : Calculatrice Asynchrone avec AWS Lambda et SQS 🧮⚙️📬

**Objectif du TP :** Mettre en place un système de calculatrice asynchrone. Les requêtes d'opérations mathématiques seront envoyées à une file d'attente SQS (la "file d'entrée"). Une fonction Lambda sera déclenchée par les messages de cette file, effectuera le calcul, puis enverra le résultat (ou une erreur) à une autre file SQS (la "file de sortie").

Ce TP illustre un pattern courant : le découplage de services et le traitement asynchrone de tâches.

## 🌟 Ce que vous allez construire :

![Architecture Lambda SQS](https://docs.aws.amazon.com/fr_fr/solutions/latest/constructs/images/aws-sqs-lambda.png)

1.  Deux **Files d'Attente SQS (Standard)** :
    *   `InputCalculatorQueue` : Pour recevoir les demandes de calcul.
    *   `OutputCalculatorQueue` : Pour recevoir les résultats des calculs.
2.  Une **Fonction Lambda** (`CalculatorFunction`) :
    *   Écrite en Python.
    *   Déclenchée par les messages arrivant sur `InputCalculatorQueue`.
    *   Code de la fonction (basé sur la version améliorée fournie) pour :
        *   Parser le message JSON (attendu : `{"number1": X, "number2": Y, "operation": "+"}` etc.).
        *   Effectuer l'opération (addition, soustraction, multiplication, division).
        *   Gérer les erreurs (division par zéro, opération inconnue, format de message incorrect).
        *   Envoyer un message JSON contenant le résultat (ou l'erreur) à `OutputCalculatorQueue`.
3.  Un **Rôle IAM pour la Fonction Lambda** avec les permissions :
    *   `sqs:ReceiveMessage`, `sqs:DeleteMessage`, `sqs:GetQueueAttributes` sur `InputCalculatorQueue`.
    *   `sqs:SendMessage` sur `OutputCalculatorQueue`.
    *   `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents` pour les logs CloudWatch (via la politique gérée `AWSLambdaBasicExecutionRole`).
4.  Un **Event Source Mapping** liant `InputCalculatorQueue` à `CalculatorFunction`.
5.  Des **Terraform Outputs** pour les URLs des files SQS.