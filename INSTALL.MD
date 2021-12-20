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

 ! npm i ~~@openzeppelin/test-helpers~~ --save-dev ! <- installe ethereumjs-* qui ajoute des dépendances à webpack 3.12.0
  -> CONFLIT avec webpack 4.44.2 dont dépend react-scripts dans le projet client
  -> TestSimpleStorage.sol ne compile pas


##client folder :
- **npm install**

 - npm i react-router-dom@6.2.1



------------
[Editor.md Open source online Markdown editor.](https://pandao.github.io/editor.md "editor.md")