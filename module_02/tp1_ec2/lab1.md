# Lab 1 : Déploiement d'une Instance EC2 avec Application Web via User Data 🚀💻🐍

Bienvenue dans ce premier Lab ! L'objectif est de déployer une instance EC2 sur AWS qui va automatiquement installer et lancer une petite application web Python au démarrage. Pour cela, nous allons utiliser CDKTF avec Python et découvrir la magie du script "User Data" d'EC2.

## 🌟 Ce que nous allons faire :

1.  **Définir l'Infrastructure** avec CDKTF dans `main.py` :
    *   Une instance EC2 (notre serveur).
    *   Un groupe de sécurité (le pare-feu de notre serveur).
    *   Configurer le volume de stockage de l'instance.
2.  **Préparer un Script de Démarrage** dans `user_data.py` :
    *   Ce script installera Python, pip, venv, clonera un dépôt Git et lancera une application web.
3.  **Lier le tout** pour que l'instance exécute le script au démarrage.
4.  **Vérifier** que notre application est accessible.

Prêt à voir votre code prendre vie sur AWS ? C'est parti !

---

## 📜 Section 1 : `user_data.py` - Le Chef d'Orchestre au Démarrage 🎶

Le fichier `user_data.py` est crucial. Il prépare le script qui sera exécuté par notre instance EC2 dès son premier lancement.

```python
# user_data.py
import base64

user_data = base64.b64encode("""#!/binbash
echo "userdata-start"
apt update
apt install -y python3-pip python3.12-venv
git clone https://github.com/JunENSAI/Cloud-AWS.git
cd Cloud-AWS/api
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
venv/bin/python app.py
echo "userdata-end"
""".encode("ascii")).decode("ascii")
```

### Que fait ce script ? 🤔

1.  **`import base64`** : On importe le module Python pour encoder notre script. EC2 attend le "User Data" en format Base64.
2.  **`user_data = base64.b64encode(...).decode("ascii")`** :
    *   La longue chaîne de caractères entre les triples guillemets (`"""..."""`) est notre **script shell**.
    *   `.encode("ascii")` transforme ce script en une suite d'octets.
    *   `base64.b64encode()` convertit ces octets en Base64.
    *   `.decode("ascii")` reconvertit le résultat en une chaîne de caractères lisible, prête à être passée à notre instance EC2.

### Contenu du Script Shell (exécuté sur l'instance) :

*   `#!/bin/bash` : Indique que c'est un script Bash.
*   `echo "userdata-start"` : Un petit message pour marquer le début dans les logs. Pratique pour le débogage !
*   `apt update` : Met à jour la liste des paquets disponibles (pour les systèmes Debian/Ubuntu, ce qui est le cas de l'AMI utilisée).
*   `apt install -y python3-pip python3.12-venv` : Installe `pip` (le gestionnaire de paquets Python) et `venv` (pour créer des environnements virtuels Python) pour Python 3.12. Le `-y` répond automatiquement "oui" aux questions.
*   `git clone https://github.com/JunENSAI/Cloud-AWS.git` : Clone le code source d'une application Python depuis GitHub. C'est une application web simple !
*   `cd Cloud-AWS/api` : Se déplace dans le dossier du code cloné.
*   `python3 -m venv venv` : Crée un environnement virtuel Python nommé `venv`. C'est une bonne pratique pour isoler les dépendances du projet.
*   `source venv/bin/activate` : Active l'environnement virtuel.
*   `pip3 install -r requirements.txt` : Installe toutes les bibliothèques Python nécessaires au projet, listées dans `requirements.txt`.
*   `venv/bin/python app.py` : Lance l'application web (`app.py`) en utilisant l'interpréteur Python de l'environnement virtuel.
*   `echo "userdata-end"` : Message pour marquer la fin du script.

En gros, ce script transforme une instance EC2 "nue" en un serveur web fonctionnel hébergeant l'application clonée. Magique, non ? ✨

---

## 🏗️ Section 2 : `main.py` - L'Architecte de notre Instance

C'est ici que nous utilisons CDKTF pour décrire l'infrastructure que nous voulons sur AWS.

```python
# main.py
#!/usr/bin/env python
from constructs import Construct
from cdktf import App, NamedRemoteWorkspace, TerraformStack, TerraformOutput, RemoteBackend # RemoteBackend et NamedRemoteWorkspace non utilisés ici
from cdktf_cdktf_provider_aws.provider import AwsProvider
from cdktf_cdktf_provider_aws.instance import Instance, InstanceEbsBlockDevice
from cdktf_cdktf_provider_aws.security_group import SecurityGroup, SecurityGroupIngress, SecurityGroupEgress
from user_data import user_data # On importe notre script encodé !

class MyStack(TerraformStack):
    def __init__(self, scope: Construct, ns: str):
        super().__init__(scope, ns)

        # 1. Configuration du Fournisseur AWS ☁️
        AwsProvider(self, "AWS", region="us-east-1")

        # 2. Création du Groupe de Sécurité (Pare-feu) 🔥🧱
        security_group = SecurityGroup(
            self, "sg-tp", # Un ID logique pour cette ressource dans CDKTF
            ingress=[ # Règles pour le trafic ENTRANT
                SecurityGroupIngress(
                    from_port=22,      # Port SSH
                    to_port=22,
                    cidr_blocks=["0.0.0.0/0"], # Autorise SSH depuis N'IMPORTE QUELLE IP ⚠️
                    protocol="TCP",
                ),
                SecurityGroupIngress(
                    from_port=80,      # Port HTTP (pour notre app web)
                    to_port=80,
                    cidr_blocks=["0.0.0.0/0"], # Autorise HTTP depuis N'IMPORTE QUELLE IP 🌐
                    protocol="TCP"
                )
            ],
            egress=[ # Règles pour le trafic SORTANT
                SecurityGroupEgress(
                    from_port=0,       # Tous les ports
                    to_port=0,
                    cidr_blocks=["0.0.0.0/0"], # Autorise la sortie vers n'importe où
                    protocol="-1"      # Tous les protocoles
                )
            ]
        )

        # 3. Création de l'Instance EC2 💻
        instance = Instance(self, "compute",
            ami="ami-04b4f1a9cf54c11d0",        # ID de l'Amazon Machine Image (Ubuntu 22.04 dans us-east-1)
            instance_type="t2.micro",         # Type d'instance (éligible au Free Tier)
            
            # Configuration du volume de stockage principal (Root Volume) 💾
            ebs_block_device= [InstanceEbsBlockDevice(
                device_name="/dev/sda1",        # Nom du périphérique racine sous Linux
                delete_on_termination=True,     # Supprime le volume si l'instance est terminée 👍
                encrypted=False,                # Volume non chiffré
                volume_size=20,                 # Taille du volume en Go (ici 20Go)
                volume_type="gp2"               # Type de volume SSD à usage général
            )],
            
            # ATTENTION : Il manque deux choses importantes ici !
            # Pour que le groupe de sécurité s'applique ET que le user_data s'exécute:
            # security_groups=[security_group.name], # Ou security_group.id pour l'ID
            # user_data=user_data,                   # On passe notre script !
        )

        # 4. Affichage de l'IP Publique en Sortie 📤
        TerraformOutput(self, "public_ip",
            value=instance.public_ip, # Récupère l'IP publique de l'instance
        )

# Initialisation de l'application CDKTF
app = App()
MyStack(app, "tp1_ec2") # Nom de notre Stack Terraform

app.synth() # Génère la configuration Terraform JSON
```