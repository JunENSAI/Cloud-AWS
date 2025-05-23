# Module 3 : Scalabilité et Haute Disponibilité avec ELB & ASG en Python (CDKTF) ⚖️🚀⚙️

Bienvenue dans le Module 3 ! Dans le module précédent, nous avons appris à créer des instances EC2 individuelles. C'est super, mais que se passe-t-il si votre application devient populaire et qu'une seule instance ne suffit plus ? Ou si cette instance tombe en panne ? 😱

C'est là qu'interviennent **Elastic Load Balancing (ELB)** et **Auto Scaling Groups (ASG)** ! Ensemble, ils vous permettent de construire des applications hautement disponibles et capables de s'adapter automatiquement à la charge.

## 🎯 Ce que vous allez apprendre dans ce module :

*   Comprendre le rôle de l'**Elastic Load Balancing (ELB)** :
    *   Qu'est-ce qu'un répartiteur de charge ?
    *   Les différents types d'ELB (principalement **Application Load Balancer - ALB**).
    *   Concepts clés : Listeners, Target Groups, Health Checks.
*   Découvrir les **Auto Scaling Groups (ASG)** :
    *   Pourquoi mettre à l'échelle automatiquement ?
    *   Composants : Launch Configurations / Launch Templates, politiques de scaling.
*   Comment ELB et ASG fonctionnent ensemble pour la résilience et la scalabilité.
*   **Avec CDKTF/Python :**
    *   Définir un Application Load Balancer (ALB).
    *   Créer un Target Group et configurer les Health Checks.
    *   Mettre en place un Auto Scaling Group avec un Launch Template.
    *   Lier l'ASG à l'ALB pour distribuer le trafic.

---

## 1. Elastic Load Balancing (ELB) : Le Grand Distributeur de Trafic 🚦

Imaginez un restaurant populaire avec une seule caisse. La file d'attente s'allonge vite ! Un Load Balancer, c'est comme ouvrir plusieurs caisses et avoir quelqu'un à l'entrée qui dirige les clients vers la caisse la moins occupée.

**Elastic Load Balancing (ELB)** distribue automatiquement le trafic entrant de vos applications sur plusieurs cibles (comme des instances EC2) dans une ou plusieurs Zones de Disponibilité (AZ).

**Avantages :**
*   ⬆️ **Haute Disponibilité :** Si une instance tombe en panne, l'ELB redirige le trafic vers les instances saines.
*   ⚖️ **Scalabilité :** Permet de gérer les pics de trafic en répartissant la charge sur plus d'instances.
*   🏥 **Health Checks :** Surveille la santé de vos instances et n'envoie du trafic qu'aux instances saines.

### Types d'ELB (Focus sur ALB) :

Il existe plusieurs types d'ELB, mais nous nous concentrerons sur l'**Application Load Balancer (ALB)** :
*   👍 **Idéal pour le trafic HTTP/HTTPS** (couche 7 du modèle OSI).
*   🧠 **Routage intelligent :** Peut router le trafic en fonction du contenu de la requête (chemin URL, en-têtes, etc.).
*   🔗 **Intégration avec ASG, ECS, EKS, Lambda.**
*   🔒 **Support SSL/TLS Termination.**

### Composants Clés d'un Application Load Balancer (ALB) :

1.  **Load Balancer (ALB lui-même)** : Le point d'entrée de votre trafic.
2.  **Listeners** 👂 : Vérifient les requêtes de connexion des clients, en utilisant le protocole et le port que vous configurez (ex: HTTP sur port 80, HTTPS sur port 443).
    *   Chaque listener a des **règles** qui déterminent comment router les requêtes vers un ou plusieurs **Target Groups**.
3.  **Target Groups (Groupes Cibles)** 🎯 :
    *   Un groupe d'instances EC2 (ou d'autres cibles comme des adresses IP, des Lambdas) qui reçoivent le trafic du load balancer.
    *   Chaque Target Group est associé à un protocole et un port pour le trafic vers les cibles.
    *   L'ALB utilise les **Health Checks (vérifications de l'état de santé)** pour déterminer si les cibles d'un Target Group sont saines et capables de recevoir du trafic.

---

## 2. Auto Scaling Groups (ASG) : L'Adaptabilité Automatique 📈📉

Un **Auto Scaling Group (ASG)** vous aide à garantir que vous avez le bon nombre d'instances EC2 disponibles pour gérer la charge de votre application. Il peut :

*   🚀 **Augmenter (Scale Out)** le nombre d'instances lorsque la demande augmente.
*   🧘 **Diminuer (Scale In)** le nombre d'instances lorsque la demande baisse (pour économiser de l'argent !).
*   ❤️ **Maintenir un nombre minimum** d'instances en cours d'exécution, en remplaçant automatiquement les instances défectueuses.

### Composants Clés d'un Auto Scaling Group :

1.  **Launch Configuration (obsolète) / Launch Template (recommandé)** 📝:
    *   C'est un **modèle** que l'ASG utilise pour lancer de nouvelles instances EC2.
    *   Il spécifie l'AMI ID, le type d'instance, la paire de clés, les groupes de sécurité, le user data, la configuration EBS, etc. (tout ce que vous mettriez pour lancer une instance manuellement).
    *   **Les Launch Templates sont plus récents et plus flexibles que les Launch Configurations.** Nous utiliserons les Launch Templates.
2.  **Auto Scaling Group (ASG lui-même)** :
    *   Définit la taille **minimale**, **maximale** et **désirée (desired)** du groupe d'instances.
    *   Spécifie les Zones de Disponibilité (AZ) dans lesquelles lancer les instances.
    *   Peut être associé à un ou plusieurs Load Balancer Target Groups pour enregistrer automatiquement les nouvelles instances.
3.  **Politiques de Scaling (Scaling Policies)** 📊 :
    *   Définissent *quand* et *comment* l'ASG doit ajouter ou supprimer des instances.
    *   Exemples :
        *   **Target Tracking Scaling :** Maintenir une métrique (ex: utilisation moyenne du CPU) à une valeur cible.
        *   **Step Scaling / Simple Scaling :** Ajuster la capacité en fonction d'une alarme CloudWatch.
        *   **Scheduled Scaling :** Planifier des changements de capacité à des moments précis.

---

## 3. ELB + ASG : Le Duo Gagnant pour des Applications Robustes 🏆

Ensemble, ELB et ASG forment une combinaison puissante :
1.  L'**ASG** s'assure que vous avez le bon nombre d'instances saines en cours d'exécution, en les lançant ou en les terminant selon les politiques de scaling.
2.  L'**ASG** enregistre automatiquement les nouvelles instances auprès du **Target Group** de l'**ALB**.
3.  L'**ALB** distribue le trafic entrant uniquement aux instances saines du Target Group.
4.  Si une instance devient défectueuse (détectée par les health checks de l'ALB ou de l'ASG), l'ALB arrête de lui envoyer du trafic, et l'ASG la remplace par une nouvelle instance saine.

Résultat : Votre application reste disponible et performante, même face aux fluctuations de charge ou aux pannes d'instances. 🎉

---

## 4. ELB et ASG avec CDKTF et Python ✍️🐍➡️🚀

Avec CDKTF, nous allons utiliser des classes Python pour définir ces services.

### Classes CDKTF (Python) Clés (depuis `cdktf_cdktf_provider_aws`) :

Pour **ALB** :
*   `lb.Lb` (pour l'Application Load Balancer lui-même)
*   `lb_listener.LbListener`
*   `lb_target_group.LbTargetGroup`
*   `lb_target_group_attachment.LbTargetGroupAttachment` (si vous attachez des instances existantes, mais l'ASG le fait souvent pour nous).

Pour **ASG** :
*   `launch_template.LaunchTemplate`
*   `autoscaling_group.AutoscalingGroup`
*   `autoscaling_policy.AutoscalingPolicy` (pour les politiques de scaling)

N'oubliez pas les `security_group.SecurityGroup` pour l'ALB et pour les instances de l'ASG !

---

## 5. Travaux Pratiques (Labs) avec CDKTF/Python 🛠️🐍

Dans les labs de ce module, vous allez (par exemple) :

1.  **Créer un Launch Template** :
    *   Définir une AMI (ex: Amazon Linux 2), un type d'instance (`t2.micro`).
    *   Inclure un `user_data` pour installer un serveur web simple (ex: Apache ou Nginx) qui affiche un message unique par instance.
    *   Associer un groupe de sécurité qui autorise le trafic HTTP sur le port 80 (depuis l'ALB) et SSH (depuis votre IP pour le débogage).
2.  **Créer un Application Load Balancer (ALB)** :
    *   Configurer un listener HTTP sur le port 80.
    *   Associer un groupe de sécurité à l'ALB qui autorise le trafic HTTP entrant depuis Internet (0.0.0.0/0).
3.  **Créer un Target Group** :
    *   Spécifier le protocole (HTTP) et le port (80) pour les cibles.
    *   Configurer les Health Checks (ex: vérifier le chemin `/` sur le port 80).
    *   Associer ce Target Group au listener de l'ALB.
4.  **Créer un Auto Scaling Group (ASG)** :
    *   Utiliser le Launch Template créé.
    *   Définir une taille min, max, et désirée (ex: min=2, max=4, desired=2).
    *   Spécifier plusieurs Zones de Disponibilité pour la haute disponibilité.
    *   **Lier l'ASG au Target Group de l'ALB** pour que les instances lancées soient automatiquement enregistrées.
    *   (Optionnel) Mettre en place une politique de scaling simple (ex: Target Tracking sur l'utilisation CPU).
5.  **Déployer avec CDKTF** (`cdktf deploy`).
6.  **Tester** :
    *   Accéder au DNS de l'ALB plusieurs fois et vérifier que vous voyez les messages des différentes instances.
    *   (Optionnel) Terminer manuellement une instance pour voir l'ASG la remplacer.
    *   (Optionnel) Générer de la charge pour voir l'ASG scaler.
7.  **Nettoyer avec `cdktf destroy`.**

---

## ✨ Prochaines Étapes

Avec ELB et ASG, vous avez les outils pour construire des applications web robustes et scalables. Dans les prochains modules, nous explorerons d'autres services AWS essentiels comme le stockage (S3, DynamoDB) et le serverless (Lambda) !