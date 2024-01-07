#!/bin/bash



#/home/ruhul/Downloads/fabric-samples/asset-transfer-basic/certificate-verification-hyperledger-fabric-application/chaincode-javascript

cd ../../test-network
./network.sh down
# ./network.sh up createChannel -c mychannel -ca
./network.sh up createChannel -c mychannel -ca

# ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/certificate-verification-hyperledger-fabric-application/chaincode-javascript/ -ccl javascript
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/certificate-verification-hyperledger-fabric-application/chaincode-javascript/ -ccl javascript

# cd ../asset-transfer-basic/application-javascript/
cd ../asset-transfer-basic/certificate-verification-hyperledger-fabric-application/

# rm -rf wallet/
rm -rf wallet/

npm install

# npm run start
npm run start



