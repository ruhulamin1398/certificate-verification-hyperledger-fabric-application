'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = 10000;
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


            let  data = {
                "universityName": "SUST",
                "universityId":"User1",
       }
       data = JSON.stringify(data)
           const myArgs = {
               contractId: this.roundArguments.contractId,
               contractFunction: 'CreateUniversity',
               invokerIdentity: 'User1',
               contractArguments: [data],
               readOnly: true
           };
   
           await this.sutAdapter.sendRequests(myArgs);
    


        
    }

    async submitTransaction() {
        const certID = "cert"+Math.floor(Math.random()*Math.random()+Math.random());

        let  data = {
                "fileHash" :  "da84e5104ec02982515127adda821ffc533acf7f07bd9b5839f31239e888feea",
                "IssueDate":"12-5-2024",
                certID,
                "studentID":"User1",
                "course":"course",
                "details":"demo details here"
            } 
    data = JSON.stringify(data)
        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'CreateCertificate',
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