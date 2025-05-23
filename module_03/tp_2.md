# TP 2 : Application Web Scalable et Hautement Disponible avec ALB et ASG 🚀⚖️💻

**Objectif du TP :** Mettre en place une architecture web simple mais robuste sur AWS en utilisant un Application Load Balancer (ALB) pour distribuer le trafic et un Auto Scaling Group (ASG) pour assurer la scalabilité et la haute disponibilité de nos instances EC2. Nous utiliserons CDKTF avec Python pour définir toute notre infrastructure.

**Scénario :** Nous allons déployer une petite application web "Hello World" qui affichera un message unique par instance. L'ALB répartira les requêtes entre les instances, et l'ASG s'assurera qu'un nombre suffisant d'instances saines sont toujours disponibles.

---

## 🌟 Ce que vous allez construire :

![Architecture ALB-ASG](https://i0.wp.com/skundunotes.com/wp-content/uploads/2023/09/82-image-0.png?fit=1200%2C676&ssl=1)
*(Note : L'image est un exemple, nous n'aurons pas de base de données dans ce TP simple, mais l'idée de l'ALB devant l'ASG est la même).*

1.  Un **VPC (Virtual Private Cloud)** : Bien que CDKTF puisse utiliser le VPC par défaut, pour de bonnes pratiques, nous pourrions en créer un nouveau avec des sous-réseaux publics dans au moins deux Zones de Disponibilité (AZ). (Pour simplifier, on peut aussi utiliser le VPC par défaut et ses sous-réseaux publics existants).
2.  Un **Groupe de Sécurité pour l'ALB** : Autorise le trafic HTTP (port 80) depuis Internet (0.0.0.0/0).
3.  Un **Groupe de Sécurité pour les Instances EC2** :
    *   Autorise le trafic HTTP (port 80) **uniquement** depuis le groupe de sécurité de l'ALB.
    *   Autorise le trafic SSH (port 22) depuis votre adresse IP pour le dépannage (optionnel mais recommandé).
4.  Un **Rôle IAM pour les instances EC2** (optionnel pour ce TP simple, mais bonne pratique pour plus tard si les instances ont besoin d'accéder à d'autres services AWS).
5.  Une **Paire de Clés SSH** (gérée par CDKTF ou importée) pour accéder aux instances (optionnel).
6.  Un **Launch Template** :
    *   Utilise une AMI Amazon Linux 2.
    *   Type d'instance `t2.micro`.
    *   **User Data** pour :
        *   Installer un serveur web (ex: Apache ou `python3 -m http.server`).
        *   **User Data** (voir `user_data_fastapi.py` fourni) pour :
        *   Installer Python, pip, venv.
        *   Créer un environnement virtuel et installer FastAPI & Uvicorn.
        *   Créer une application FastAPI `main.py` avec les routes :
            *   `GET /` : Message de bienvenue indiquant l'ID de l'instance.
            *   `GET /hello/{name}` : Renvoie "Hello {name} from instance {ID}!"
            *   `GET /bonjour/{name}` : Renvoie "Bonjour {name} from instance {ID}!"
            *   `GET /salama/{name}` : Renvoie "Salama {name} from instance {ID}!"
        *   Lancer Uvicorn sur le port **8000**, en écoutant sur `0.0.0.0`.
    *   Associé au groupe de sécurité des instances.
    *   Associé au groupe de sécurité des instances.
7.  Un **Application Load Balancer (ALB)** :
    *   Public (accessible depuis Internet).
    *   Associé au groupe de sécurité de l'ALB.
    *   Déployé sur les sous-réseaux publics des AZ choisies.
8.  Un **Target Group** pour l'ALB :
    *   Protocole HTTP, port 80.
9.  Un **Listener** sur l'ALB :
    *   Écoute sur le port 80 (HTTP).
    *   Action par défaut : transférer le trafic vers le Target Group créé.
10. Un **Auto Scaling Group (ASG)** :
    *   Utilise le Launch Template.
    *   Taille désirée : 2 instances.
    *   Taille minimale : 2 instances.
    *   Taille maximale : 4 instances.
    *   Déployé sur les mêmes sous-réseaux publics que l'ALB.
    *   Associé au Target Group de l'ALB (pour enregistrer les instances).
    *   (Optionnel) Une politique de scaling simple (ex: "Target Tracking" pour maintenir l'utilisation CPU moyenne à 50%).
11. Des **Terraform Outputs** pour :
    *   Le DNS de l'ALB (pour y accéder via un navigateur).