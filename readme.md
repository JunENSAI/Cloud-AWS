# 🚀 Cours AWS + Terraform avec CDKTF & Python ! ☁️🐍🛠️

Bienvenue dans ce cours conçu pour vous emmener des concepts du cloud AWS jusqu'à la mise en place d'infrastructures modernes et automatisées en utilisant **Terraform via le Cloud Development Kit (CDKTF) avec Python** ! L'objectif est de vous rendre autonome et confiant dans la gestion de vos ressources AWS en utilisant l'Infrastructure as Code (IaC) de manière programmable.

## 🤔 Pourquoi ce cours ?

*   **Programmez votre Infrastructure :** Exploitez la puissance de Python pour définir votre infrastructure AWS.
*   **Approche Moderne avec CDKTF :** Utilisez un outil qui combine la flexibilité des langages de programmation avec la robustesse de Terraform.
*   **Pratique avant tout :** Chaque concept théorique sera illustré par des exemples concrets et des labs en Python avec CDKTF.
*   **Pertinence :** AWS est le leader du cloud, Terraform l'outil IaC de référence, et Python un langage incontournable.
*   **Démarrage rapide :** Ce cours est conçu pour vous aider à vous lancer rapidement dans la programmation d'infrastructures AWS avec Python et CDKTF.

## 🎯 Ce que vous allez apprendre

Voici le plan de bataille des modules que nous allons couvrir, en utilisant Python et CDKTF :

1.  **Module 1 : Introduction au Cloud, à l'IaC et à CDKTF avec Python**
    *   Les concepts du Cloud : **IaaS, PaaS, SaaS**.
    *   Vue d'ensemble d'AWS.
    *   Introduction à l'Infrastructure as Code (IaC) et à **Terraform**.
        *   Bref aperçu de HCL (langage natif de Terraform).
    *   Découverte de **CDKTF** : principes, installation, et comment il s'intègre avec Terraform.
    *   Configuration de votre environnement Python avec `pipenv`.

2.  **Module 2 : Les Fondations du Calcul avec EC2 en Python (CDKTF)**
    *   Introduction à **Amazon EC2**.
    *   Instances, AMI, types d'instances, Key Pairs.
    *   Groupes de sécurité (Security Groups) et stockage EBS.
    *   **Avec CDKTF/Python :** Créer et gérer vos instances EC2 de manière programmable.

3.  **Module 3 : Scalabilité et Haute Disponibilité en Python (CDKTF)**
    *   **Elastic Load Balancing (ELB)** et **Auto Scaling Groups (ASG)**.
    *   **Avec CDKTF/Python :** Mettre en place un ELB et un ASG.

4.  **Module 4 : Stockage Flexible et Performant en Python (CDKTF)**
    *   **Amazon S3** et **Amazon DynamoDB**.
    *   **Avec CDKTF/Python :** Créer des buckets S3 et des tables DynamoDB.

5.  **Module 5 : Le Monde Serverless avec Lambda en Python (CDKTF)**
    *   Introduction à **AWS Lambda**.
    *   **Avec CDKTF/Python :** Déployer des fonctions Lambda (dont le code peut aussi être en Python !).

6.  **Module 6 : Amazon API Gateway avec Lambda et CDKTF**
    *   Application web en ReactJs qui communiquera avec une API Lambda.
    *   API Gateway (REST API vs HTTP API), Ressources, Méthodes, Intégrations (Lambda, HTTP), Stages, Modèles de mapping, Autorisation (API Keys, IAM, Lambda Authorizers, Cognito).
    *   Créer une HTTP API (plus simple et moderne) ou une REST API.
    *   Intégrer une fonction Lambda existante comme backend.
    *   Configurer les routes et les méthodes.
    *   **Avec CDKTF/Python :** Déployer l'API.

---

## 🛠️ Prérequis

*   Un compte AWS (le niveau gratuit "Free Tier" sera suffisant).
*   **AWS CLI** installée : La CLI (Command Line Interface) d'AWS https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
*   **Python (3.7+ recommandé)** et **`pipenv`** installés.
*   **Node.js et npm** (pour installer la CLI de CDKTF) : https://nodejs.org/en/download
*   **Terraform CLI** installée (CDKTF l'utilise en arrière-plan) : https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli
*   **CDKTF CLI** installée : https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install
*   AWS CLI configurée.
*   Une envie d'apprendre et de coder votre infrastructure !

## 📖 Comment utiliser ce dépôt ?

Chaque module aura son propre dossier contenant :
* Dans chaque lab si vous voulez commencer de zéro il faut juste se placer dans le bon module et créer un dossier pour contenir votre travail aussi vous vous deplacerez dans ce dossier et faire : `cdktf init --template="python" --providers="aws@~>5.0" --local`.
* Ou bien vous pouvez normalement l'utiliser tel qu'il est et juste vous devez vous s'assurer que les dependances sont bien installées avec `pipenv sync`.
*   Les explications théoriques.
*   Les fichiers Python (`.py`) pour les projets CDKTF.
*   Un `Pipfile` pour gérer les dépendances Python.
*   Des instructions claires pour réaliser les exercices (`lab*.md`).

## 🤝 Contribution

Les suggestions, corrections et améliorations sont les bienvenues ! N'hésitez pas à ouvrir une "Issue" ou à proposer une "Pull Request".

---

C'est parti pour l'aventure Cloud + CDKTF avec Python ! 🚀🐍.