# Medialocales-Airtable
Visualisation sur Airtable des résultats d'audience des radios sur le plan local, à partir des exports de Paprika Web (Médiamétrie) 

## Pré-requis 

* Avoir les exports au format Excel, fournis par Médiamétrie (souscripteurs uniquement) : 3 fichiers pour chacun des 3 univers : agglomérations, départements et régions. 
* Disposer d'un compte [Airtable](https://airtable.com) (gratuit), et la [clé API](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-) associée
* [Node.JS](https://nodejs.org/en/) installé 

## Lancement 

1. Créer un fichier de configuration, à partir de l'exemple

```
cp .env_example .env
```

2. Créer une nouvelle base Airtable, simplement en dupliquant [celle-ci fournie en template](). Récupérer l'ID de votre base Airtable ainsi créée, via la documentation API de la base (cliquer sur le bouton "Help" en haut à droite de la base)

2. Modifier le fichier de configuration ainsi créé (`.env`), selon vos paramètres personnels

3. Lancer le programme 
```
npm i && npm run start
```
