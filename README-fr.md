
<!-- ![cooltext400798739959192](https://user-images.githubusercontent.com/16133390/147348820-9db84863-9431-4e67-814c-f1e1ddde8372.png) -->

<img src="./header.svg" width="800" height="400" alt="Click to see the source">

# Lazy Kindler

# ✨ Fonctionnalités

- 🌈 Importez des livres et affichez la liste de livres efficacement.

- 💅 Créez des collections, telles qu'une collection de romans de science-fiction ou de romans d'arts martiaux.

- 🚀 Affichage multidimensionnel, affichez la liste des livres par titre, auteur, note, collection, tags, etc.

- 🛡 Recherchez des livres en utilisant n'importe quel mot-clé, tel que le titre, l'auteur ou l'éditeur.

- 📦 Téléchargez les livres soit via le menu contextuel clic droit soit en téléchargeant tous les livres gérés par la plateforme.

- 🛡 Lecture de livre : la plateforme prend en charge une fonctionnalité de lecture de livre.

- 📦 Fonctionnalité sauvegarde : La plateforme utilise `sqlite3` pour la base de données et stocke tous les livres dans un répertoire désigné pour faciliter leur sauvegarde.

- 🎻 Importation automatique des notes surlignées lorsqu'on connecte l'ordinateur à `kindle`.

- 📣 Importation des notes surlignées depuis l'application Android `静读天下apk` (Jing Du Tian Xia).

- 🎺 Notes surlignées : prise en charge du "surlignage secondaire" et "suppression du surlignage secondaire" pour les notes importées.

-🥁 Ajout commentaires aux notes surlignées

-🎻 Créez des collections pour les notes surlignées et gérez-le catégoriquement

-🚀 Kindle Vocabulary Builder: La plateforme prend en charge l'importation de livres, de mots et d'exemples depuis le Kindle Vocabulary Builder.

# Plateformes prises en charge

Actuellement adapté uniquement pour la plate-forme `mac`, il peut y avoir des erreurs inconnues lors de l'exécution sur la plate-forme `windows`.

# Formats eBook pris en charge

mobi et azw3. Les autres types d'eBooks seront automatiquement ignorés lors de l'importation.

# Problème résolu

Après avoir téléchargé **des milliers** d'eBooks sur Internet, comment les gérer efficacement ?

<br />

La qualité des différents eBooks varie considérablement, certains étant écrits par des auteurs ordinaires et d'autres par des écrivains renommés dans le monde entier. Il existe également de nombreux genres différents, tels que la science-fiction, la romance, la fantasy et bien plus encore.

<br />

Si vous devez chercher un livre dans un répertoire contenant des milliers de livres à chaque fois, cela donne mal à la tête. Par conséquent, il est nécessaire de gérer ces eBooks de manière appropriée afin que nous puissions rechercher des livres dans une plage plus restreinte basée sur nos préférences spécifiques , trouver rapidement le livre souhaité et éviter ainsi perdre trop temps à chercher.

<br />

`lazykindler` est né pour cette raison.

# Introduction des fonctionnalités

## 1. Importation de livres

Cliquez sur le bouton `Télécharger un fichier`, et la plateforme analysera récursivement les fichiers de livres électroniques pris en charge dans des répertoires tels que `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, etc. Les fichiers en double ne seront pas téléchargés à nouveau.

<br />

Actuellement, seuls les formats `mobi` et` azw3` sont pris en charge pour l'importation, et la plate-forme ne fournit pas de fonctionnalité de conversion de format d'eBook. Il est facile de trouver des eBooks dans des formats spécifiques; je les trouve généralement sur ce site Web: http://www.fast8.com. L'avantage de ce site est qu'il offre une large sélection de livres, et plusieurs options de format sont disponibles lors du téléchargement. Téléchargez simplement les livres dans le format souhaité.

## 2. Ajouter des métadonnées aux livres

Vous pouvez modifier la note du livre, les tags, la collection, l'auteur, l'éditeur et la couverture du livre. Notez que ces opérations ne modifieront pas réellement le fichier du livre lui-même mais ajouteront des enregistrements à la base de données.

## 3. Analyse d'informations sur les livres

Après avoir importé des eBooks, la plateforme extraira automatiquement les données à partir des fichiers eBook pour afficher les informations et gérer le livre.

## 4 Collections

Vous pouvez créer des collections de livres telles que «Collection Science Fiction», «Collection Roman Fantastique», «Collection Roman Romance», etc. Ajoutez des couvertures représentatives aux collections que vous aimez, et vous pouvez «noter» et «ajouter des tags» aux collections. Chaque collection peut avoir des livres sélectionnés et ajoutés à partir de la bibliothèque, et vous pouvez également noter, ajouter des tags et ajouter des couvertures aux collections. Une fois que vous avez plusieurs collections, vous pouvez rechercher directement les livres dans ces collections à l'avenir.

## 5 Affichage

Pour prendre en charge l'affichage de livres sous différents angles, vous pouvez "noter" et "ajouter des tags" aux livres ainsi que "modifier les auteurs" et "modifier les éditeurs". Les livres peuvent être affichés selon diverses dimensions telles que `note`, `tags`, `auteur`et`éditeur`. De plus, vous pouvez `` modifier la couverture du livre``.

## 6 Téléchargement

Les livres sur la plateforme peuvent être téléchargés en cliquant sur le bouton ``Télécharger`` dans la section ``Opération`` de la carte du livre. Les livres téléchargés seront enregistrés dans le répertoire personnel de l'utilisateur sous ``Download`` ou ``下载``. En cliquant sur ``Tout télécharger``, tous les livres seront téléchargés dans le dossier ``Documents`` ou ``文稿`` sous le répertoire principal lazykindler du répertoire personnel de l'utilisateur. Cliquer plusieurs fois sur «Tout télécharger» ne re-télécharge pas les fichiers existants.

## 7 Lecture

La plate-forme fournit des fonctions basiques pour lire les eBooks. Actuellement, je n'ai pas trouvé une bibliothèque pour implémenter la lecture des formats `mobi` et `azw3` en utilisant `reactjs`. Par conséquent, lors de la première fois où vous cliquez sur le bouton ``Lire le livre``, la plateforme convertira ces deux formats au format ``epub``. L'outil utilisé pour la conversion est `/Applications/calibre.app/Contents/MacOS/ebook-convert`, donc l'ordinateur doit avoir installé `calibre` pour utiliser correctement la fonction de lecture du livre. La conversion n'est requise que la première fois que vous cliquez sur "Lire le livre". La page peut devenir non réactive pendant une courte période, ce qui est normal. Le temps d'attente dépend de la taille du eBook, mais c'est généralement rapide. Les livres convertis sont stockés dans le répertoire ``backend/data`` de la plate-forme principale.
<br />

## 8. Flux de traitement

Les livres affichés sur la page `Livres -> Bibliothèque` sont des livres officiellement stockés, tandis que les nouveaux livres importés sont affichés sur la page `Livres -> Temporaire`. (Mis à part la différence d'emplacement de page, il n'y a pas beaucoup de différence entre les livres officiels et temporaires dans le backend).

<br />

Après qu'un livre "temporaire" est ajouté à une collection quelconque, il sera déplacé de `Livres -> Temporaire` à `Livres -> Bibliothèque`. Le but est de **distinguer entre les livres stockés officiellement et les livres temporairement importés. Les livres stockés officiellement ont été filtrés, les livres indésirables supprimées et classifiées, tandis que les livres temporairement importées ont tendance à être diverses.**

## 9. Sauvegarde

La base de données utilisée est sqlite3 située dans le fichier lazykindler.db du backend.

<br />

Lorsque la plateforme est lancée pour la première fois, le fichier de base de données sera automatiquement créé et initialisé. Ce fichier contient toutes les informations relatives aux données dans la plateforme sauf pour les livrse eux-mêmes qui sont copiées vers le répertoire data/backend/. Notez que pour faciliter l'opération interne de la plate-forme, le nom des fichiers des livre dans ce répertoire se voit ajouter leur valeur md5.

<br />

Pour sauvegarder tous les fichiers et données présents sur cette plateforme , enregistrez simplement lazykindler.db et data/backend. Pour démarrer le service dans un autre emplacement la prochaine fois, copiez lazykindler.db et data/backend aux positions correspondantes.

## 10. Importation des surlignages Kindle

Cette fonctionnalité est actuellement uniquement prise en charge sur la plateforme Mac.

<br />

La plate-forme détectera automatiquement si le `Kindle` est connecté. Lorsque le `Kindle` est connecté à l'ordinateur, la plate-forme importera le fichier `My Clippings.txt` du `Kindle` pour une gestion unifiée et une présentation multidimensionnelle. Lorsque le fichier My Clippings.txt du kindle change, la plateforme importera automatiquement les nouveaux contenus ajoutés dans My Clippings.txt, sans importer de manière répétitive les anciennes données. Les utilisateurs peuvent voir les nouveaux contenus ajoutés en actualisant la page après avoir connecté leur Kindle à l'ordinateur.

<br />

Il convient de noter que le Kindle traite les notes de surlignage ajoutées par l'utilisateur sous forme d'un bloc de texte sans saut de ligne, même s'il s'agit du contenu de plusieurs paragraphes. Lazykindler reconnaît intelligemment et traite les sauts de ligne lorsqu'il importe le fichier My Clippings.txt du Kindle comme indiqué ci-dessous.

<img src="https://user-images.githubusercontent.com/16133390/210229975-4e7145e7-5d91-4aff-85ff-f5550fd7fe2c.png" width="66%">

## 11.Réaliser un second soulignement sur des notes soulignées

Les notes soulignées font partie du texte ou des paragraphes connexes que nous soulignons et enregistrons lors de la lecture d'un livre, souvent parce qu'une phrase ou un mot a un certain impact sur nous. Après avoir importé les notes surlignées dans la plateforme, il est nécessaire de mettre en évidence les phrases ou les mots qui ont résonné avec vous à ce moment-là pendant le processus de tri ultérieur, facilitant ainsi la mise en évidence et l'affichage de cette petite section du texte qui a résonné avec vous.

<br />

Avec `lazykindler`, vous pouvez facilement effectuer un second soulignement. Il suffit de sélectionner le texte pertinent et cliquer sur "OK" dans la boîte de dialogue automatiquement affichée.

<img src="https://user-images.githubusercontent.com/16133390/210230077-c9a4532b-aafc-4ba2-a163-cd151c98d831.png" width="66%">

## 12. Ajouter des commentaires aux notes surlignées

Vous pouvez enregistrer quelques réflexions sur le texte qui ont résonné avec vous.

<img width="1379" alt="Xnip2023-02-05_15-19-18" src="https://user-images.githubusercontent.com/16133390/216806787-4b76a541-608d-4e8e-9d8e-2651bf7842ef.png">

## 13. Importer les surlignements de l'application Jingdu Tianxia

`Jingdu Tianxia apk` est un lecteur populaire sur la plateforme Android. J'utilise actuellement ce logiciel pour lire des livres sur mon e-reader Hisense, et le logiciel prend également en charge l'ajout de notes surlignées. J'ai donc ajouté la prise en charge de l'importation de notes surlignées à partir de ce logiciel.

<br />

Le format du fichier de notes surlignées exporté depuis `Jingdu Tianxia apk` est `.mrexpt`. Placez ce fichier dans n'importe quel répertoire tel que `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, etc., et la plateforme peut automatiquement effectuer l'opération d'importation.

## 14. Importer Kindle Vocabulary Builder

Vocabulary Builder est une fonctionnalité dans Kindle qui enregistre les mots ou phrases recherchés lors de la lecture d'un livre. Cette méthode peut être utilisée pour lire des livres originaux anglais et enregistrer des mots, qui peuvent être utilisés pour apprendre et revoir ces mots plus tard. La plateforme prend en charge l'importation de ces vocabulaires.

Sur la base de l'importation de ces vocabulaires, la plateforme fournit une bonne interface pour afficher cette information, et vous pouvez créer manuellement des vocabulaires et des exemples, ainsi que ajouter des traductions aux exemples.

<img width="1322" alt="Xnip2023-03-31_23-23-41" src="https://user-images.githubusercontent.com/16133390/229163528-952ee43f-bf31-43a7-b39b-98d637e584da.png">

<img width="1320" alt="Xnip2023-03-31_23-23-57" src="https://user-images.githubusercontent.com/16133390/229163550-8c321a41 -7df4 - 41af -9bd0-fd765e113a1f.png">

# Configuration requise

`python 3.10.4`

`nodejs v19.6.0`

`Calibre`

Les autres versions n'ont pas été testées

# Démarrer le service

## Installer les dépendances

1. Exécutez dans le répertoire `backend`

```

pip3 install -r requirements.txt

```

2. Si vous avez besoin d'utiliser la fonctionnalité `chatgpt`, veuillez configurer la clé `chatgpt` dans `backend/config.ini`. L'adresse pour générer la clé sur le site officiel OpenAi est `https://platform.openai.com/account/api-keys`.

3. Exécutez dans le répertoire `frontend`

```

yarn install

```

## Démarrer le service

```

./start.sh

```

Ensuite, visitez http://localhost:8000 dans votre navigateur.

## Arrêter le service

```

./stop.sh

```

## Remarque

La plateforme est conçue pour les particuliers et ne dispose pas de fonctionnalités telles que la connexion et l'inscription.

# Présentation de la plateforme

Ci-dessous se trouvent des captures d'écran de ma configuration locale après avoir téléchargé des livres et configuré des collections.

<img width="1418" alt="1" src="https://user-images.githubusercontent.com/16133390/216806475-97ee4960-40cc-4649-b414-0687724bb6ad.png">
<br />
<img width="1398" alt="Xnip2023-02-05_15-13-49" src="https://user-images.githubusercontent.com/16133390/216806612-dc1baf4f-7ed5-4b3d-ab44-73c7f07c73a7.png">
<br />
<img width="1418" alt="2" src="https://user-images.githubusercontent.com/16133390/216806480-def76f45-f8ba-41fc-9512-a448e9fbce32.png">
<br />
<img width="1418" alt="3" src="https://user-images.githubusercontent.com/16133390/216806485-caf74fe2-0cef-45f8-9a29-47780e72132d.png">
<br />
<img width="1799" alt="Xnip2023-02-14_12-36-20" src="https://user-images.githubusercontent.com/16133390/218640667-ba74048a-3b78-41c6-a772-dc1e56485b56.png">

<br />
<img width="1801" alt="Xnip2023-02-14_12-36-38" src="https://user-images.githubusercontent.com/16133390/218640680-263195c2-7ac3-4947-b7a5-b70375074e9c.png">

<br />

# Autre

L'outil le plus célèbre pour `kindle` devrait être `calibre`, mais les fonctionnalités de ce logiciel sont davantage axées sur "l'édition", et l'affichage multidimensionnel des livres électroniques est relativement simple. Par conséquent, je prévois d'écrire un outil spécifiquement destiné à la gestion des livres électroniques qui répond aux besoins pratiques.

Actuellement, je développe cet outil pendant mon temps libre. Si vous aimez également lire des livres électroniques et avez des suggestions pour les fonctionnalités de gestion de livres électroniques, n'hésitez pas à soulever une question.

Si vous avez des problèmes ou des demandes de fonctionnalités, veuillez contacter l'auteur par e-mail: wupengcn301@gmail.com, WeChat: leowucn. Merci.
