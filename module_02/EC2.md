# Module 2 : Les Fondations du Calcul avec EC2 en Python (CDKTF) 💻🐍⚙️

Bienvenue dans le Module 2 ! Après avoir découvert CDKTF et Python pour l'IaC dans le module précédent, il est temps de créer nos premières machines virtuelles (instances) sur AWS avec **Amazon EC2** (Elastic Compute Cloud). Nous utiliserons bien sûr CDKTF et Python pour définir et gérer ces instances.

Ce module est essentiel car les instances EC2 sont un composant fondamental de nombreuses architectures cloud, servant de "cerveaux" 🧠 ou de "muscles" 💪 pour vos applications.

## 🎯 Ce que vous allez apprendre dans ce module :

*   Comprendre ce qu'est **Amazon EC2** et ses principaux concepts :
    *   **Instances** : Vos serveurs virtuels.
    *   **AMI (Amazon Machine Image)** : Les modèles pour vos instances.
    *   **Types d'instances** : Les différentes "tailles" et capacités.
    *   **Régions et Zones de Disponibilité (AZ)** : Où vos instances vivent.
*   Gérer l'accès sécurisé avec les **Key Pairs (paires de clés SSH)** 🔑.
*   Contrôler le trafic réseau avec les **Security Groups (groupes de sécurité)** 🔥🧱 en Python.
*   Comprendre le stockage persistant avec les **EBS Volumes (Elastic Block Store)** 💾.
*   Utiliser les **User Data** pour personnaliser vos instances au démarrage 📜🚀.
*   **Avec CDKTF/Python :** Déclarer, créer et gérer vos instances EC2, groupes de sécurité, et paires de clés de manière programmable.

---

## 1. Qu'est-ce qu'Amazon EC2 ? 🤔

Amazon Elastic Compute Cloud (EC2) est un service web qui fournit une capacité de calcul redimensionnable dans le cloud. En termes simples, il vous permet de louer des serveurs virtuels (appelés **instances**) sur lesquels vous pouvez exécuter vos applications.

### Concepts Clés d'EC2 :

*   **Instance** 💻 : C'est un serveur virtuel dans le cloud AWS. Vous pouvez choisir son système d'exploitation, sa puissance de calcul (CPU), sa mémoire (RAM), son stockage et sa capacité réseau.
*   **AMI (Amazon Machine Image)** 💿 : C'est un modèle qui contient une configuration logicielle (système d'exploitation, serveur d'applications, applications). Vous utilisez une AMI pour lancer une instance. AWS fournit de nombreuses AMIs (Linux, Windows), et vous pouvez aussi créer les vôtres.
*   **Type d'Instance** 💪 : Définit la configuration matérielle de votre instance (famille, nombre de vCPUs, mémoire, stockage, performances réseau). Il existe des dizaines de types d'instances optimisés pour différents cas d'usage (usage général, calcul intensif, mémoire intensive, etc.). Par exemple, `t2.micro` ou `t3.small` sont des types courants pour commencer.
*   **Régions et Zones de Disponibilité (AZ)** 🌍📍:
    *   Une **Région** est une zone géographique distincte (ex: `us-east-1` en Virginie du Nord, `eu-west-3` à Paris).
    *   Chaque Région est composée de plusieurs **Zones de Disponibilité (AZ)**. Une AZ est un ou plusieurs datacenters discrets, chacun avec une alimentation, un refroidissement et une mise en réseau redondants. Déployer des instances dans plusieurs AZ augmente la haute disponibilité de vos applications.

---

## 2. Sécurité de vos Instances EC2 🔐

La sécurité est primordiale. Deux concepts principaux pour EC2 :

*   **Key Pairs (Paires de Clés SSH)** 🔑 :
    *   Pour vous connecter à vos instances Linux en toute sécurité, vous utilisez une paire de clés : une clé **privée** (que vous gardez secrète sur votre machine) et une clé **publique** (que vous installez sur l'instance EC2).
    *   Lorsque vous lancez une instance, vous pouvez spécifier le nom d'une paire de clés existante ou en créer une nouvelle.
    *   Avec CDKTF, nous pouvons gérer la création ou l'importation de clés publiques dans AWS.

*   **Security Groups (Groupes de Sécurité)** 🔥🧱 :
    *   C'est un **pare-feu virtuel** au niveau de l'instance qui contrôle le trafic entrant et sortant.
    *   Par défaut, tout le trafic entrant est refusé et tout le trafic sortant est autorisé.
    *   Vous définissez des **règles** (ingress pour entrant, egress pour sortant) pour autoriser spécifiquement le trafic sur certains ports, protocoles (TCP, UDP, ICMP) et depuis/vers certaines sources/destinations (adresses IP, autres groupes de sécurité).
    *   Un groupe de sécurité peut être associé à plusieurs instances.

---

## 3. Stockage pour vos Instances EC2 : EBS 💾

Amazon Elastic Block Store (EBS) fournit des volumes de stockage en mode bloc persistants à utiliser avec les instances EC2.

*   **Volumes EBS** : Ce sont comme des disques durs virtuels que vous pouvez attacher à vos instances.
*   **Persistance** : Les données sur un volume EBS persistent indépendamment de la durée de vie de l'instance. Si vous arrêtez ou terminez une instance, les données sur les volumes EBS attachés (sauf si configuré pour être supprimé à la terminaison) restent.
*   **Types de Volumes** : Différents types pour différents besoins de performance et de coût (ex: `gp2`/`gp3` pour un usage général SSD, `io1`/`io2` pour des IOPS élevées).
*   **Snapshots** 📸 : Vous pouvez créer des "snapshots" (sauvegardes ponctuelles) de vos volumes EBS et les stocker sur S3 pour la durabilité.

Lorsque vous lancez une instance, elle a toujours un **volume racine (root volume)** qui contient le système d'exploitation. Vous pouvez ajouter des volumes EBS supplémentaires pour les données.

---

## 4. User Data : Personnalisation au Démarrage 📜🚀

Comme vu dans le Lab 1, le "User Data" est un script que vous pouvez fournir à une instance EC2 pour qu'il soit exécuté lors du premier démarrage. C'est extrêmement utile pour :

*   Installer des mises à jour et des logiciels.
*   Configurer des applications.
*   Télécharger du code.
*   Joindre un domaine, etc.

Le script User Data est généralement encodé en Base64.

---

## 5. Gérer EC2 avec CDKTF et Python ✍️🐍➡️💻

Avec CDKTF, nous allons utiliser des classes Python fournies par le provider AWS pour définir nos ressources EC2.

### Classes CDKTF (Python) Clés pour EC2 (depuis `cdktf_cdktf_provider_aws`) :

*   `provider.AwsProvider` : Pour configurer la région et les identifiants AWS.
*   `instance.Instance` : Pour créer et gérer une instance EC2. C'est ici que vous spécifiez l'AMI, le type d'instance, la paire de clés, les groupes de sécurité, le user data, et la configuration des volumes EBS (via `ebs_block_device` ou `root_block_device`).
*   `key_pair.KeyPair` : Pour gérer une paire de clés SSH (typiquement en important une clé publique existante que vous avez générée localement).
*   `security_group.SecurityGroup` : Pour définir un groupe de sécurité.
    *   Les règles `ingress` (entrantes) et `egress` (sortantes) sont définies directement comme listes d'objets `SecurityGroupIngress` et `SecurityGroupEgress` (ou des dictionnaires respectant leur structure) à l'intérieur de la définition du `SecurityGroup`.
*   `data_aws_ami.DataAwsAmi` : (Optionnel mais très utile) Pour rechercher dynamiquement une AMI basée sur des filtres (ex: l'AMI Amazon Linux 2 la plus récente) au lieu de coder en dur un ID d'AMI.
*   `ebs_volume.EbsVolume` (Optionnel) : Pour créer des volumes EBS supplémentaires (non racine) de manière explicite.
*   `volume_attachment.VolumeAttachment` (Optionnel) : Pour attacher des volumes EBS supplémentaires à une instance.

### Structure du Projet CDKTF :

Nous continuerons à utiliser la structure générée par `cdktf init`:
*   `main.py` : Définition de notre stack et de nos ressources.
*   `user_data.py` (si besoin) : Pour externaliser les scripts de démarrage.
*   `cdktf.json` : Configuration CDKTF, incluant le provider AWS.
*   `Pipfile` : Gestion des dépendances Python.

---

## 6. Travaux Pratiques (Labs) avec CDKTF/Python 🛠️🐍

Dans les labs de ce module (comme celui que vous venez de détailler), vous allez :

1.  **Préparer votre environnement CDKTF Python.**
2.  **Écrire votre code Python dans `main.py` pour :**
    *   Configurer le provider `AwsProvider`.
    *   (Optionnel) Utiliser `DataAwsAmi` pour trouver une AMI.
    *   Créer un `SecurityGroup` autorisant le trafic nécessaire (ex: SSH sur le port 22, HTTP sur le port 80).
    *   (Optionnel mais recommandé) Créer une ressource `KeyPair` en important votre clé publique SSH.
    *   Lancer une `Instance` EC2 avec :
        *   L'AMI choisie.
        *   Le type d'instance (ex: `t2.micro`).
        *   Le groupe de sécurité.
        *   La paire de clés.
        *   Une configuration `ebs_block_device` pour le volume racine (taille, type, suppression à la terminaison).
        *   Un script `user_data` pour installer des logiciels ou une application.
    *   Définir des `TerraformOutput` pour l'IP publique et/ou l'ID de l'instance.
3.  **Exécuter le workflow CDKTF :**
    *   `cdktf synth`
    *   `cdktf deploy` (ou `terraform -chdir... plan/apply`)
4.  **Vérifier votre instance :**
    *   Connexion SSH.
    *   Accès à l'application web via l'IP publique si configurée.
5.  **Nettoyer les ressources avec `cdktf destroy` (ou `terraform -chdir... destroy`).**

---

## ✨ Prochaines Étapes

Maintenant que vous maîtrisez la création d'instances EC2 individuelles, le module suivant vous montrera comment les rendre plus résilientes et scalables avec les Load Balancers et les Auto Scaling Groups !