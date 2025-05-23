# TP 3 : Gestion de Données Utilisateurs avec S3 et DynamoDB 👤🖼️💾

**Objectif du TP :** Mettre en place une infrastructure de stockage simple pour une application fictive. Nous allons créer un bucket S3 pour stocker les "photos de profil" des utilisateurs et une table DynamoDB pour stocker les informations de base de ces utilisateurs. Ensuite, nous utiliserons un script Python avec Boto3 pour peupler ces ressources avec des données d'exemple.

**Scénario :** Notre application a besoin de stocker des informations sur 100 utilisateurs (nom, email, etc.) et une photo de profil pour au moins l'un d'entre eux.

---

## 🌟 Ce que vous allez construire et faire :

1.  **Avec CDKTF/Python (Infrastructure) :**
    *   Un **Bucket S3** privé pour stocker les photos de profil.
    *   Une **Table DynamoDB** pour stocker les informations des utilisateurs, avec un schéma de clé approprié.
2.  **Avec un script Python et Boto3 (Données) :**
    *   Générer (ou utiliser un fichier fourni) un fichier JSON contenant les données de ~100 utilisateurs avec 5 attributs chacun.
    *   Écrire un script pour :
        *   Lire le fichier JSON.
        *   Insérer chaque utilisateur comme un item dans la table DynamoDB.
        *   Téléverser les images contenu dans le dossier s3 local  dans le bucket S3.
3.  **Vérification :**
    *   Confirmer que les données sont bien dans DynamoDB et que les photo est dans S3 via la console AWS ou l'AWS CLI.
4.  **Scipt python :**
    *   Créer un script Python pour compter le nombre d'utilisateurs dans la table DynamoDB.
    *   Créer un script Python pour afficher les informations d'un utilisateur par son 'email' de la table DynamoDB.
5.  **Destruction :**
    *   Supprimer le bucket S3 et la table DynamoDB.
    -``Attention`` : souvent quand le bucket s3 n'est pas vide il faut le vider avant de pouvoir le supprimer.


---
