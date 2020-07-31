# Medialocales-Airtable

Compatibilité : données S19-J20

Visualisation sur Airtable des résultats d'audience des radios sur le plan local, à partir des exports de Paprika Web (Médiamétrie)

## Pré-requis

- Avoir les exports au format Excel, fournis par Médiamétrie (souscripteurs uniquement) : 3 fichiers pour chacun des 3 univers : agglomérations, départements et régions.
- Disposer d'un compte [Airtable](https://airtable.com) (gratuit), et la [clé API](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-) associée
- [Node.JS](https://nodejs.org/en/) installé

## Résultats

_(données floutées car réservées aux abonnés)_

1. Il est ainsi possible d'avoir une visualisation en un coup d'oeil des résultats pour une radio en particulier (Vue `Visualisation pour une radio`, Filtre `Entité` --> écrire le nom de la radio)

![Récapitulatif par radio](https://vocast.s3.eu-west-3.amazonaws.com/tech/r%C3%A9capitualtif+par+radio.png)

2. Les résultats groupés par univers / zone et les options pour ordonner donnent rapidement les classements selon les critères d'audience désirés (AC, DEA, etc.)

![Exemple de groupement par univers et zone](https://vocast.s3.eu-west-3.amazonaws.com/tech/exemple+groupement+par+univers-zone.png)

3. En jouant avec les filtres et mécanismes de tris, il est facil de comparer les performances selon des critères disparates

![Crééer de multiples classements](https://vocast.s3.eu-west-3.amazonaws.com/tech/classements.png)

## Lancement

1. Créer un fichier de configuration, à partir de l'exemple

```
cp .env_example .env
```

2. Créer une nouvelle base Airtable, simplement en dupliquant [la base "Medialocales 19-20" fournie en template](https://airtable.com/shrj5zYdbE8Fvt4aC). Récupérer l'ID de votre base Airtable ainsi créée, via la documentation API de la base (cliquer sur le bouton "Help" en haut à droite de la base)

3. Modifier le fichier de configuration ainsi créé (`.env`), selon vos paramètres personnels

4. Lancer le programme

```
npm i && npm run start
```

# Contact, support

Si vous avez besoin d'aide pour obtenir vos résultats sur Airtable, n'hésitez pas à [nous contacter](https://vocast.fr/contact) (contact@vocast.fr)

Ceci est un projet à but non lucratif dans le cadre de [Vocast](https://vocast.fr).

[Des Ondes Vocast](https://vocast.fr/desondes), c'est la radio d'hier, d'aujourd'hui et de demain, en un podcast ! Des archives qui ont marqué la bande FM aux discussions autour des futurs possibles du média, [Des Ondes Vocast](https://vocast.fr/desondes) est dédié aux passionnés de radio.
