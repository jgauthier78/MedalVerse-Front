# Install

##root folder :
- **npm install**

> - Detail of root packages :
 - npm i dotenv --save-dev
 - npm i web3 --save-dev
 - npm i @truffle/hdwallet-provider --save-dev
 - npm i @openzeppelin/contracts --save-dev
 - npm i @openzeppelin/contracts-upgradeable --save-dev
 - npm i mocha chai --save-dev
 - npm i chai-bignumber --save-dev

 Doc
  - npm install --save-dev solc-0.8@npm:solc@^0.8.0
  - npm install solidity-docgen --save-dev

 DID
 - npm i @3id/connect
 - npm i @ceramicnetwork/3id-did-resolver
 - npm i @ceramicnetwork/http-client
 - npm i dids
 - npm i @ceramicstudio/idx (encore valable mais déprécié)

 ! npm i ~~@openzeppelin/test-helpers~~ --save-dev ! <- installe ethereumjs-* qui ajoute des dépendances à webpack 3.12.0
  -> CONFLIT avec webpack 4.44.2 dont dépend react-scripts dans le projet client
  -> TestSimpleStorage.sol ne compile pas

  - Globally installed required packages
  - npm install -g truffle
  - npm install -g ganache-cli

##client folder :
- **npm install**

 - npm i react-router-dom@6.2.1
 - npm i react-router-bootstrap@0.26.0
 - npm i bootstrap


------------
[Editor.md Open source online Markdown editor.](https://pandao.github.io/editor.md "editor.md")