### Caliper installation and use will be based on a local npm installation. Within the caliper-workspace directory, install caliper CLI using the following terminal command:
```
npm install --only=prod @hyperledger/caliper-cli@0.5.0
```
### Bind the SDK using the following terminal command:
```
npx caliper bind --caliper-bind-sut fabric:2.2
```

### In the terminal run the following Caliper CLI command:
```
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/networkConfig.yaml --caliper-benchconfig benchmarks/config.yaml --caliper-flow-only-test 
```


-------
------
----

### A Consortium Blockchain-Based Platform for Academic Certificate Verification

#### Table 1. The summary of performance benchmark produced by Hyperledger Caliper.

```
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/networkConfig.yaml --caliper-benchconfig benchmarks/config-an-tran-table-read.yaml --caliper-flow-only-test 

```

#### Table 2. The summary of performance benchmark produced by Hyperledger Caliper. - 

```
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/networkConfig.yaml --caliper-benchconfig benchmarks/config-an-tran-table-read-single.yaml --caliper-flow-only-test 

```


