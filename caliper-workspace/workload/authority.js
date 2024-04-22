'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

       
            const authorityId = `${this.workerIndex}`;
            console.log(`Worker ${this.workerIndex}: Creating asset ${authorityId}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'initLedger',
                invokerIdentity: 'User1',
                contractArguments: [],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);


            for (let i=0; i<this.roundArguments.assets; i++) {
                const authorityId = Math.floor(Math.random()*Math.random()+Math.random());

                let  data = {
                     "name": "Omer Saad",
                "issuedBy": "User1",
                authorityId,
                "otherInformation": "Contract owner",
                "status": 1,
                "type": "authority"
            }
            data = JSON.stringify(data)

            const myArgs = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'addAuthorityMember',
                invokerIdentity: 'User1',
                contractArguments: [data],
                readOnly: true
            };
    
            await this.sutAdapter.sendRequests(myArgs);
            }


    }

    async submitTransaction() {
        const randomId = Math.floor(Math.random()*this.roundArguments.assets);


        let  data = {
       "type": "authority"
   }
   data = JSON.stringify(data)



        // authority


        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'GetAllAssets',
            invokerIdentity: 'User1',
            contractArguments: [data],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(myArgs);
    }

    async cleanupWorkloadModule() {
        // for (let i=0; i<this.roundArguments.assets; i++) {
        //     const assetID = `${this.workerIndex}_${i}`;
        //     console.log(`Worker ${this.workerIndex}: Deleting asset ${assetID}`);
        //     const request = {
        //         contractId: this.roundArguments.contractId,
        //         contractFunction: 'DeleteAsset',
        //         invokerIdentity: 'User1',
        //         contractArguments: [assetID],
        //         readOnly: false
        //     };

        //     await this.sutAdapter.sendRequests(request);
        // }
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;