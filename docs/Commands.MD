## Ganache

- ganache-cli -p 8545 --networkId 3333 --chainId 3334 -m "my very secret twelve words seed that no one must ever know" --db "C:\tmp\ganache-cli\db2021-12-08" -v -b 5

------------


## Truffle

### compile
- truffle compile

### deploy
####Testnet
-  truffle deploy --reset --network maticMumbaiTestnet
-  truffle deploy --reset --network kovan
-  truffle deploy --reset --network ropsten

####Local
- truffle deploy --reset --network devlocalbenoist

------------


##React
-  npm run start
-  npm run startBrave