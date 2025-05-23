
# Module 5 : Le Monde Merveilleux du Serverless avec AWS Lambda en Python (CDKTF) 🚀☁️🐍

Bienvenue dans le Module 5 ! Jusqu'à présent, nous avons principalement travaillé avec des infrastructures qui nécessitent de gérer des serveurs (même si ASG automatise beaucoup de choses pour EC2). Il est temps de plonger dans le **Serverless** avec **AWS Lambda** !

Avec Lambda, vous exécutez votre code sans provisionner ni gérer de serveurs. Vous payez uniquement pour le temps de calcul que vous consommez, et AWS s'occupe de la disponibilité, de la scalabilité, des correctifs, etc.

## 🎯 Ce que vous allez apprendre dans ce module :

*   Comprendre ce qu'est **AWS Lambda** :
    *   Les principes du Serverless Computing.
    *   Comment fonctionne une fonction Lambda ?
    *   Événements et Triggers : Ce qui déclenche une fonction Lambda.
    *   Langages supportés (focus sur Python).
    *   Rôles IAM pour les permissions Lambda.
*   Cas d'usage courants pour Lambda.
*   **Avec CDKTF/Python :**
    *   Définir une fonction Lambda simple en Python.
    *   Packager le code de la fonction Lambda.
    *   Créer le rôle IAM nécessaire pour la fonction.
    *   Configurer un trigger simple pour la fonction (ex: une invocation manuelle ou via API Gateway - ce dernier sera peut-être un module bonus).

---

## 1. Qu'est-ce qu'AWS Lambda ? 🤔

AWS Lambda est un service de calcul qui vous permet d'exécuter du code sans avoir à provisionner ou à gérer des serveurs (d'où le terme "Serverless", bien qu'il y ait toujours des serveurs quelque part, mais *vous* ne les gérez pas).

### Principes du Serverless avec Lambda :

*   🚫 **Pas de gestion de serveur :** Vous ne vous souciez pas de l'OS, des correctifs, de la scalabilité de l'infrastructure sous-jacente.
*   💰 **Paiement à l'usage :** Vous payez pour le nombre de requêtes à vos fonctions et pour la durée d'exécution de votre code (arrondi à la milliseconde près).
*   📈 **Scalabilité automatique :** Lambda s'adapte automatiquement à la charge, de quelques requêtes par jour à des milliers par seconde.
*   🏃 **Exécution basée sur les événements :** Les fonctions Lambda sont déclenchées en réponse à des événements provenant d'autres services AWS ou d'applications personnalisées.

### Comment fonctionne une Fonction Lambda ?

1.  **Vous écrivez votre code** (la "fonction Lambda") dans l'un des langages supportés (Python, Node.js, Java, Go, C#, Ruby, etc.).
2.  **Vous téléversez votre code** sur AWS Lambda, soit sous forme de fichier zip, soit via une image de conteneur.
3.  **Vous configurez la fonction :**
    *   Mémoire allouée (affecte aussi le CPU).
    *   Timeout (durée maximale d'exécution).
    *   Variables d'environnement.
    *   **Rôle IAM** (pour les permissions dont la fonction a besoin pour interagir avec d'autres services AWS).
4.  **Vous définissez un ou plusieurs Triggers (déclencheurs) :**
    *   Un événement se produit (ex: un fichier est ajouté à un bucket S3, une requête arrive sur une API Gateway, une nouvelle entrée dans une table DynamoDB via Streams, un message dans une file SQS, un timer CloudWatch Events).
    *   Cet événement invoque votre fonction Lambda.
5.  **AWS Lambda exécute votre code** dans un environnement d'exécution sécurisé et isolé, en lui passant les données de l'événement.
6.  Votre fonction traite l'événement et peut retourner un résultat.

### Langages et Environnement d'Exécution :

*   Lambda fournit des environnements d'exécution gérés pour de nombreux langages. Pour Python, vous pouvez choisir différentes versions (ex: Python 3.8, 3.9, 3.10, 3.11, 3.12).
*   Vous pouvez inclure des bibliothèques et des dépendances dans votre package de déploiement.

### Rôles IAM pour Lambda 🛡️ :

Chaque fonction Lambda est associée à un **rôle IAM (Identity and Access Management)**. Ce rôle définit les permissions que votre fonction aura pour accéder à d'autres services et ressources AWS.
*   **Principe du moindre privilège :** Ne donnez à votre fonction que les permissions strictement nécessaires pour accomplir sa tâche.
*   Exemple : Si une fonction doit lire des objets d'un bucket S3, son rôle IAM doit avoir une politique autorisant `s3:GetObject` sur ce bucket spécifique.

---

## 2. Cas d'Usage Courants pour Lambda 💡

Lambda est incroyablement polyvalent. Voici quelques exemples :

*   **Traitement de données en temps réel :**
    *   Réagir aux téléversements de fichiers sur S3 (redimensionner des images, analyser des logs).
    *   Traiter les flux de données de Kinesis ou les Streams DynamoDB.
*   **Backends pour applications web et mobiles (API Serverless) :**
    *   Utiliser API Gateway comme trigger pour exposer vos fonctions Lambda en tant qu'API RESTful.
*   **Tâches planifiées et automatisation :**
    *   Utiliser CloudWatch Events (EventBridge) pour déclencher des fonctions Lambda à intervalles réguliers (ex: sauvegardes, rapports).
*   **Chatbots et assistants virtuels.**
*   **Applications IoT (Internet des Objets).**

---

## 3. Déployer des Fonctions Lambda avec CDKTF et Python ✍️🐍➡️☁️

Avec CDKTF, nous allons définir :
*   La fonction Lambda elle-même.
*   Le rôle IAM et sa politique de permissions.
*   Le code source de la fonction (souvent packagé en .zip).

### Classes CDKTF (Python) Clés (depuis `cdktf_cdktf_provider_aws`) :

*   `lambda_function.LambdaFunction` : Pour définir la fonction Lambda.
    *   Propriétés importantes : `function_name`, `role` (ARN du rôle IAM), `handler` (point d'entrée dans votre code), `runtime` (ex: `python3.9`), `filename` (chemin vers le .zip du code) ou `s3_bucket`/`s3_key` (si le .zip est sur S3), `memory_size`, `timeout`, `environment` (pour les variables d'environnement).
*   `iam_role.IamRole` : Pour créer le rôle IAM que la fonction Lambda assumera.
    *   Nécessite une `assume_role_policy` qui permet au service Lambda (`lambda.amazonaws.com`) d'assumer ce rôle.
*   `iam_policy.IamPolicy` ou `iam_role_policy_attachment.IamRolePolicyAttachment` : Pour attacher des politiques de permissions au rôle IAM.
    *   Vous pouvez définir une `IamPolicy` inline ou attacher des politiques gérées par AWS (ex: `AWSLambdaBasicExecutionRole` pour les logs CloudWatch).
*   `lambda_permission.LambdaPermission` : Pour accorder à un autre service AWS (ex: S3, API Gateway) la permission d'invoquer votre fonction Lambda.
*   `lambda_event_source_mapping.LambdaEventSourceMapping` : Pour configurer des triggers provenant de services comme DynamoDB Streams, Kinesis, SQS.

### Gestion du Code Source de la Fonction :

1.  **Écrire le code Python de votre fonction Lambda** dans un fichier séparé (ex: `lambda_handler.py`).
2.  **Packager ce code (et ses dépendances) dans un fichier .zip.**
    *   Vous pouvez le faire manuellement ou utiliser des outils/scripts pour automatiser cela.
    *   CDKTF fournit aussi une classe `Asset` (depuis `cdktf`) qui peut aider à packager et téléverser des assets comme des fichiers .zip vers S3, que la ressource `LambdaFunction` peut ensuite référencer. Pour des fonctions simples, on peut pointer directement vers un .zip local.

