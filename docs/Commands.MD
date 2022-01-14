## Ganache

- ganache-cli -p 8545 --networkId 3333 --chainId 3334 -m "my very secret twelve words seed that no one must ever know" --db "C:\tmp\ganache-cli\db2021-12-08" -v -b 5

------------

## Truffle

### compile
- truffle compile

### test
- truffle test  .\test\simplestorage-test.js -g a

### deploy

#### testnet
-  truffle deploy --reset --compile-none --network maticMumbaiTestnet
-  truffle deploy --reset --network kovan
-  truffle deploy --reset --network ropsten

#### local
- truffle deploy --reset --network devlocalbenoist

### Doc
- npx solidity-docgen --solc-module solc-0.8 -o .\\docs\\solidity-docs

------------


## React
-  npm run start
-  npm run startBrave