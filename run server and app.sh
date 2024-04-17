#!/bin/bash





cd ../test-network
./network.sh down

./network.sh up createChannel -c mychannel -ca -s couchdb
# ./network.sh up createChannel -c mychannel -ca 

./network.sh deployCC -ccn basic -ccp ../certificate-verification-hyperledger-fabric-application/chaincode-javascript/ -ccl javascript

cd ../certificate-verification-hyperledger-fabric-application


rm -rf wallet/

npm install

# npm run start
npm run start



