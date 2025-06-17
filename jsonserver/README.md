# Projet API REST avec JSON Server

Doc officielle :
https://www.npmjs.com/package/json-server

## 1. Linux (Ubuntu/Debian)

Je recommande d'utiliser nvm (Node Version Manager) pour une gestion flexible des versions de Node.js.

### Utiliser nvm

Installez nvm en exécutant le script d'installation :
```bash
curl -o- [https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh](https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh) | bash
```
Après l'installation, fermez et rouvrez votre terminal, ou exécutez source ~/.bashrc (ou source ~/.zshrc si vous utilisez Zsh) pour que nvm soit reconnu par votre shell.

Installez la dernière version stable de Node.js :
```bash
nvm install node
```

Une fois que Node.js et npm sont correctement installés sur votre système, vous pouvez installer JSON Server globalement.

Ouvrez votre terminal (ou invite de commandes) et exécutez la commande suivante :

```bash
npm install -g json-server
```

Pour démarrer votre API, assurez-vous que vous êtes dans le répertoire où se trouve votre fichier data.json. Ensuite, exécutez la commande suivante :
```bash
json-server  data.json --port 3000
```

## 2. Sur Windows

Téléchargez l'installateur MSI (.msi) directement depuis le site officiel de Node.js : https://nodejs.org/fr/download/

Suivez les étapes de l'installateur. npm sera inclus par défaut.

Puis installer json server

```bash
npm install -g json-server
```

Pour démarrer votre API, assurez-vous que vous êtes dans le répertoire où se trouve votre fichier data.json. Ensuite, exécutez la commande suivante :
```bash
json-server  data.json --port 3000
```

## 3. Sur Mac
Utiliser Homebrew

Si vous n'avez pas Homebrew, installez-le en exécutant :

```bash
/bin/bash -c "$(curl -fsSL [https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh](https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh))"
```

Installez Node.js via Homebrew :
```bash
brew install node
```

Puis installer json server
```bash
npm install -g json-server
```

Pour démarrer votre API, assurez-vous que vous êtes dans le répertoire où se trouve votre fichier data.json. Ensuite, exécutez la commande suivante :
```bash
json-server  data.json --port 3000
```