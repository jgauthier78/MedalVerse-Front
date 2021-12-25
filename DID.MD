# DID

- Ceramic : enregistrement de flux signés par le DID du propriétaire

- 3ID Connect : gestion de l'authentification et du compte de l'utilisateur en stockant les clés privées / seed DID sur IDX (3D ID keychain). La seed est chiffrée/déchifrée par le clé privée du wallet.
Permet d'associer un/plusieurs DID à un/plusieurs wallet

- IDX : Protocole décentralisé d'identité pemret d'associer des données à un DID
3D Connect -> Référence/crée/récupère le DID dans IDX

CAIP-10 Link : lie un compte (wallet) à un DID ; enregistré par 3ID Connect

### W3C
#### Decentralized Identifiers (DIDs) v1.0
[W3C Proposed Recommendation 03 August 2021](https://www.w3.org/TR/did-core/#relative-did-urls "W3C Proposed Recommendation 03 August 2021")
[Use Cases and Requirements for Decentralized Identifiers](https://www.w3.org/TR/did-use-cases/ "Use Cases and Requirements for Decentralized Identifiers")

### Ceramic
Multi-chain compatibles EVM
création d'un ID sur Ethereum, réutilisation sur Polygon / xDai

#### Demo
[Ceramic Web Playground](https://ceramicstudio.github.io/web-playground/ "Ceramic Web Playground")


#### Tutorials
https://blog.ceramic.network/
1. [What is 3ID Connect?](https://blog.ceramic.network/what-is-3id-connect/ "What is 3ID Connect?")
2. [How to use 3ID Connect in browser applications](https://blog.ceramic.network/how-to-use-3id-connect-in-browser-applications/ "How to use 3ID Connect in browser applications")
3. [Add authentication with new blockchains in 3ID Connect](https://blog.ceramic.network/add-authentication-with-new-blockchains-in-3id-connect/ "Add authentication with new blockchains in 3ID Connect")

### IDX

https://developers.idx.xyz/learn/welcome/
https://developers.idx.xyz/learn/overview/

DID -> index -> liste de definitionID
definitionID -> enregistrement (record) + schema JSON (definition)
tout ces objets sont des "stream" enregistrés sur Ceramic


npm i @3id/connect --save-dev
npm i @ceramicnetwork/3id-did-resolver --save-dev
npm i @ceramicnetwork/http-client --save-dev
npm i dids --save-dev

encore valable mais déprécié:
npm i @ceramicstudio/idx --save-dev

a remplacer par
@datamodels

Nécessite ES2020 -> Utiliser React avec le template Typescript
https://github.com/facebook/create-react-app/releases/tag/v3.3.0

npm i @3id/connect npm i @ceramicnetwork/3id-did-resolver npm i @ceramicnetwork/http-client npm i dids npm i @ceramicstudio/idx --save-dev


https://blog.ceramic.network/the-next-architecture-for-building-web3-data-applications/