# Module 4 : Stockage Flexible et Performant avec S3 & DynamoDB en Python (CDKTF) 💾📦⚙️

Bienvenue dans le Module 4 ! Maintenant que nous savons comment gérer le calcul (EC2) et la scalabilité (ALB/ASG), il est temps de nous pencher sur le **stockage de données**. AWS offre une multitude d'options, mais nous allons nous concentrer sur deux services piliers :
*   **Amazon S3 (Simple Storage Service)** : Pour le stockage d'objets.
*   **Amazon DynamoDB** : Pour les bases de données NoSQL.

Nous apprendrons à les définir et à les gérer avec CDKTF et Python.

## 🎯 Ce que vous allez apprendre dans ce module :

*   Comprendre **Amazon S3** :
    *   Qu'est-ce que le stockage d'objets ?
    *   Concepts clés : Buckets, Objets, Clés, Classes de stockage, Versioning, Politiques.
    *   Cas d'usage courants (hébergement de sites statiques, backups, data lakes).
*   Découvrir **Amazon DynamoDB** :
    *   Introduction aux bases de données NoSQL.
    *   Concepts clés : Tables, Items, Attributs, Clés primaires (Partition Key, Sort Key), Index, Modes de capacité.
    *   Cas d'usage courants (profils utilisateurs, catalogues, sessions).
*   **Avec CDKTF/Python :**
    *   Créer et configurer des buckets S3.
    *   Définir des tables DynamoDB avec leurs schémas de clés et attributs.

---

## 1. Amazon S3 (Simple Storage Service) 🗄️

Amazon S3 est un service de stockage d'objets qui offre une scalabilité, une disponibilité des données, une sécurité et des performances de pointe. Pensez-y comme un espace de stockage quasi infini pour tous types de fichiers.

### Concepts Clés d'S3 :

*   **Bucket** 🧺 : Un conteneur pour les objets stockés dans S3. Les noms de bucket S3 sont **globalement uniques** (comme les noms de domaine sur Internet).
*   **Objet** 📄🖼️🎬 : L'entité fondamentale stockée dans S3. Un objet se compose de :
    *   **Données** (le fichier lui-même).
    *   **Clé (Key)** : Le nom unique de l'objet à l'intérieur d'un bucket (ex: `images/mon_chat.jpg`).
    *   **Métadonnées** : Un ensemble de paires nom-valeur qui décrivent l'objet (ex: type de contenu, date de dernière modification).
*   **Préfixes et Délimiteurs** 📂 : Bien qu'S3 soit un stockage plat (pas de vrais dossiers), vous pouvez simuler une hiérarchie de dossiers en utilisant des préfixes dans les clés d'objets (ex: `dossier1/sous_dossier/fichier.txt`).
*   **Classes de Stockage** 💽 : Différentes options pour stocker vos objets en fonction de la fréquence d'accès et des besoins de résilience, avec des coûts variables (ex: S3 Standard, S3 Intelligent-Tiering, S3 Glacier).
*   **Versioning** 🔄 : Permet de conserver plusieurs versions d'un objet dans le même bucket. Utile pour la récupération en cas de suppression ou de modification accidentelle.
*   **Politiques de Bucket et ACLs** 📜🔐 : Mécanismes pour contrôler l'accès à vos buckets et objets.
*   **Hébergement de Sites Web Statiques** 🌐 : S3 peut servir directement le contenu statique (HTML, CSS, JS, images) de votre site web.

### Cas d'Usage Courants :

*   Stockage d'images, vidéos, et autres assets pour applications web/mobiles.
*   Sauvegardes et archivage de données.
*   Data lakes pour l'analytique Big Data.
*   Distribution de logiciels.

### S3 avec CDKTF/Python :

Classes CDKTF clés (depuis `cdktf_cdktf_provider_aws`) :
*   `s3_bucket.S3Bucket` : Pour créer et configurer un bucket.
    *   Propriétés importantes : `bucket` (nom), `acl`, `versioning`, `website`, `policy`.
*   `s3_bucket_object.S3BucketObject` : Pour téléverser un objet simple lors du déploiement (souvent utilisé pour des fichiers de configuration initiaux).
    *   Pour des opérations de données plus complexes ou dynamiques, on utilise généralement le SDK AWS (Boto3) *après* la création du bucket via CDKTF.
*   `s3_bucket_policy.S3BucketPolicy` : Pour attacher une politique d'accès JSON au bucket.
*   `s3_bucket_public_access_block.S3BucketPublicAccessBlock` : Pour gérer les paramètres de blocage de l'accès public.

---

## 2. Amazon DynamoDB : La Base de Données NoSQL Ultra-Rapide ⚡️📊

Amazon DynamoDB est un service de base de données NoSQL clé-valeur et document entièrement géré, conçu pour des performances rapides et prévisibles avec une scalabilité transparente.

### Concepts Clés de DynamoDB :

*   **Table** 🍽️ : Un conteneur pour vos données, similaire à une table dans une base de données relationnelle, mais sans schéma fixe pour tous les items (hormis la clé primaire).
*   **Item** 📝 : Un ensemble d'attributs. Similaire à une ligne ou un enregistrement. Chaque item a une clé primaire unique.
*   **Attribut** 🏷️ : Un élément de données fondamental, comme une colonne. Les attributs peuvent être de différents types (String, Number, Binary, Boolean, List, Map, Set). Un item n'a pas besoin d'avoir tous les mêmes attributs que les autres items de la table (sauf la clé primaire).
*   **Clé Primaire (Primary Key)** 🔑 : Identifie de manière unique chaque item dans une table. Il existe deux types de clés primaires :
    *   **Clé de Partition (Partition Key / HASH Key)** : Une simple clé primaire composée d'un seul attribut. DynamoDB utilise la valeur de la clé de partition comme entrée pour une fonction de hachage interne pour déterminer la partition (emplacement de stockage physique) où l'item est stocké.
    *   **Clé de Partition et Clé de Tri (Sort Key / RANGE Key)** : Une clé composite. Deux items peuvent avoir la même clé de partition, mais ils doivent avoir des valeurs de clé de tri différentes. Les items avec la même clé de partition sont stockés ensemble, triés par la clé de tri.
*   **Index Secondaires (Secondary Indexes)** 🔎 : Permettent d'interroger les données de la table en utilisant des attributs autres que ceux de la clé primaire.
    *   **Index Secondaire Local (LSI)** : Utilise la même clé de partition que la table, mais une clé de tri différente.
    *   **Index Secondaire Global (GSI)** : Peut utiliser une clé de partition et une clé de tri différentes de celles de la table. C'est comme créer une nouvelle "vue" de votre table avec une organisation différente.
*   **Modes de Capacité** ⚙️ :
    *   **Provisionné (Provisioned Throughput)** : Vous spécifiez le nombre d'unités de capacité de lecture (RCU) et d'écriture (WCU) par seconde que votre application nécessite.
    *   **À la Demande (On-Demand)** : Vous payez pour ce que vous consommez (lectures/écritures réelles) sans avoir à provisionner de capacité. Idéal pour les charges de travail imprévisibles ou nouvelles.
*   **Streams** 🌊 : Capture les modifications de données dans une table DynamoDB (créations, mises à jour, suppressions) et permet de déclencher des actions (ex: fonctions Lambda).

### Cas d'Usage Courants :

*   Profils utilisateurs et gestion de sessions.
*   Paniers d'achat et catalogues de produits.
*   Classements de jeux (leaderboards).
*   Systèmes de gestion de contenu, métadonnées.

### DynamoDB avec CDKTF/Python :

Classe CDKTF clé (depuis `cdktf_cdktf_provider_aws`) :
*   `dynamodb_table.DynamodbTable` : Pour créer et configurer une table.
    *   Propriétés importantes : `name`, `billing_mode`, `hash_key` (partition key), `range_key` (sort key, optionnel), `attribute` (pour définir les types des attributs de clé et d'index), `global_secondary_index`, `local_secondary_index`.

---

## 3. Gérer le Stockage avec CDKTF et Python ✍️🐍

L'approche avec CDKTF reste la même :
1.  **Définir** vos ressources S3 (buckets) et DynamoDB (tables) en tant que classes Python dans votre stack.
2.  **Configurer** leurs propriétés (noms, clés, politiques d'accès, modes de capacité, etc.).
3.  **Synthétiser** (`cdktf synth`) votre code Python en JSON Terraform.
4.  **Déployer** (`cdktf deploy` ou `terraform apply`) pour créer ou mettre à jour l'infrastructure sur AWS.

**Important :** CDKTF est principalement utilisé pour définir et gérer l'**infrastructure** (le bucket, la table). Pour les opérations sur les **données** (téléverser des milliers de fichiers dans S3, insérer des millions d'items dans DynamoDB), vous utiliserez typiquement le SDK AWS (Boto3 dans Python) dans des scripts séparés ou des applications, *après* que CDKTF ait provisionné les ressources.

---

## 🛠️ Travaux Pratiques (Labs) dans ce Module :

Dans le TP de ce module (`tp3.md`), vous allez :
*   Créer un bucket S3 pour stocker des "photos" d'utilisateurs.
*   Créer une table DynamoDB pour stocker des informations sur ces utilisateurs.
*   Écrire un script Python (utilisant Boto3) pour charger des données d'exemple (utilisateurs depuis un JSON, et une "photo" dans S3).

---

## ✨ Prochaines Étapes

Après avoir maîtrisé le stockage, nous explorerons le monde fascinant du "Serverless" avec AWS Lambda, qui s'intègre d'ailleurs très bien avec S3 et DynamoDB !