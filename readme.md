# 🚀 Cours AWS + Terraform : Devenez un Pro du Cloud ! ☁️ IaC 🛠️

Bienvenue dans ce cours conçu pour vous emmener des bases d'AWS et de Terraform jusqu'à la mise en place d'infrastructures cloud modernes et automatisées ! L'objectif est de vous rendre autonome et confiant dans la gestion de vos ressources sur AWS en utilisant l'Infrastructure as Code (IaC) avec Terraform.

## 🤔 Pourquoi ce cours ?

-   **Pratique avant tout :** Chaque concept théorique sera illustré par des exemples concrets et des labs avec Terraform.
-   **Pertinence :** AWS est le leader du cloud, et Terraform est l'outil IaC de référence.
-   **Approche "sympa" :** On essaie d'apprendre sérieusement sans se prendre au sérieux !

## 🎯 Ce que vous allez apprendre

Voici le plan de bataille des modules que nous allons couvrir :

1.  **Module 1 : Introduction au Cloud et à l'Infrastructure as Code (IaC)**
    *   Les grands concepts du Cloud Computing : **IaaS, PaaS, SaaS**.
    *   Pourquoi AWS ? Vue d'ensemble des services principaux.
    *   Introduction à l'Infrastructure as Code (IaC).
    *   Découverte de **Terraform** : principes, installation, syntaxe HCL de base.
    *   Votre premier `terraform apply` !

2.  **Module 2 : Les Fondations du Calcul avec EC2**
    *   Introduction à **Amazon EC2** (Elastic Compute Cloud).
    *   Instances, AMIs, types d'instances, key pairs.
    *   Groupes de sécurité (Security Groups) et stockage EBS.
    *   **Avec Terraform :** Créer et gérer vos premières instances EC2.

3.  **Module 3 : Scalabilité et Haute Disponibilité**
    *   **Elastic Load Balancing (ELB)** : Répartir la charge entre vos instances.
        *   Application Load Balancer (ALB).
    *   **Auto Scaling Groups (ASG)** : Adapter automatiquement votre capacité.
        *   Launch Configurations / Launch Templates.
        *   Politiques de scaling.
    *   **Avec Terraform :** Mettre en place un ELB et un ASG pour une application résiliente.

4.  **Module 4 : Stockage Flexible et Performant**
    *   **Amazon S3 (Simple Storage Service)** :
        *   Buckets, objets, classes de stockage.
        *   Gestion des versions, politiques de cycle de vie.
        *   Hébergement de sites statiques.
    *   **Amazon DynamoDB** :
        *   Introduction au NoSQL.
        *   Tables, items, clés primaires, index secondaires.
        *   Capacités provisionnées et à la demande.
    *   **Avec Terraform :** Créer des buckets S3 et des tables DynamoDB.

5.  **Module 5 : Le Monde Merveilleux du Serverless avec Lambda**
    *   Introduction à **AWS Lambda** : Exécuter du code sans gérer de serveurs.
    *   Fonctions Lambda, triggers (événements S3, API Gateway...).
    *   Rôles IAM pour Lambda.
    *   Cas d'usage courants.
    *   **Avec Terraform :** Déployer une fonction Lambda simple.

6.  **Module 6 : Introduction aux Pipelines CI/CD pour l'Infrastructure (Bonus)**
    *   *Note : On explore ensemble cette partie, même si c'est nouveau pour moi aussi, l'idée est de comprendre les bases !*
    *   Qu'est-ce qu'un pipeline CI/CD (Intégration Continue / Déploiement Continu) ?
    *   Comment Terraform s'intègre dans une démarche DevOps ?
    *   Aperçu des outils AWS : CodeCommit, CodeBuild, CodePipeline (très basique).
    *   Gestion de l'état Terraform (remote state) dans un contexte d'équipe/pipeline.
    *   **Avec Terraform :** Principes d'organisation de code (modules, environnements) pour faciliter l'automatisation.

---

## 🛠️ Prérequis

*   Un compte AWS (le niveau gratuit "Free Tier" sera suffisant pour la plupart des labs).
*   Des bases en ligne de commande (Linux/macOS/Windows PowerShell).
*   Terraform installé sur votre machine.
*   AWS CLI configurée.
*   Une envie d'apprendre et d'expérimenter !

## 📖 Comment utiliser ce dépôt ?

Chaque module aura son propre dossier contenant :
*   Les explications théoriques (potentiellement des slides ou des notes).
*   Les fichiers Terraform (`.tf`) pour les labs.
*   Des instructions claires pour réaliser les exercices.

## 🤝 Contribution

Les suggestions, corrections et améliorations sont les bienvenues ! N'hésitez pas à ouvrir une "Issue" ou à proposer une "Pull Request".

---

C'est parti pour l'aventure Cloud + Terraform ! 🚀