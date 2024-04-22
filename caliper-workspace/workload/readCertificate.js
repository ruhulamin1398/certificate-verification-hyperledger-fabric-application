'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        for (let i=0; i<this.roundArguments.assets; i++) {
            const assetID = `${this.workerIndex}_${i}`;

            console.log(`Worker ${this.workerIndex}: Creating asset ${assetID}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'CreateCertificate',
                invokerIdentity: 'User1',
                contractArguments:[JSON.stringify({
                    "fileHash": "a1b2c3d4e5f6",
                    "IssueDate": "2024-01-12",
                    "certID": assetID,
                    "universityName": "HI University",
                    "universityPK": "UNIVPK123",
                    "issuingOfficerPK": "ISSUERPK456",
                    "studentPK": "STUDENTPK789",
                    "course": "Computer Science"
                })],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }

    async submitTransaction() {
        const randomId = Math.floor(Math.random()*this.roundArguments.assets);
        const assetID = `${this.workerIndex}_${randomId}`;
        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'ReadCertificate',
            invokerIdentity: 'User1', 
            contractArguments: [JSON.stringify({
                "certID": assetID,
            })],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(myArgs);
    }

    async cleanupWorkloadModule() {
        for (let i=0; i<this.roundArguments.assets; i++) {
            const assetID = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Deleting asset ${assetID}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'DeleteAsset',
                invokerIdentity: 'User1',
                contractArguments: [assetID],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
