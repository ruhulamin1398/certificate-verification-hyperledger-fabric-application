'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.txtcount = 0;
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


        for (let i = 0; i < this.roundArguments.assets; i++) {
            const certID = "y" + this.txtcount;
            this.txtcount = this.txtcount + 1;

            console.log("cert ===================================  " + certID)

            let data = {
                "fileHash": "da84e5104ec02982515127adda821ffc533acf7f07bd9b5839f31239e888feea",
                "IssueDate": "12-5-2024",
                certID,
                "studentID": "user1",
                "course": "course",
                "details": "demo details here"
            }
            data = JSON.stringify(data)
            const myArgs = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'CreateCertificate',
                invokerIdentity: 'User1',
                contractArguments: [data],
                readOnly: false
            };


            // console.log(data)

            console.log(await this.sutAdapter.sendRequests(myArgs));
        }



        for (let i = 0; i < this.roundArguments.assets; i++) {
            const certID = "y" + this.txtcount;
            this.txtcount = this.txtcount + 1;

            console.log("cert ===================================  " + certID)

            let data = {
                "fileHash": "da84e5104ec02982515127adda821ffc533acf7f07bd9b5839f31239e888feea",
                "IssueDate": "12-5-2024",
                certID,
                "studentID": "user1",
                "course": "course",
                "details": "demo details here"
            }
            data = JSON.stringify(data)
            const myArgs = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'CreateCertificate',
                invokerIdentity: 'User1',
                contractArguments: [data],
                readOnly: false
            };


            // console.log(data)

            console.log(await this.sutAdapter.sendRequests(myArgs));
        }



    }

    async submitTransaction() {
        const randomId = Math.floor(Math.random() * this.roundArguments.assets);


        let data = {
            "shareWithID": "user1",
            "id": "y" + randomId,
            "prefix": "cert"
        }
        data = JSON.stringify(data)



        // authority


        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'ShareCertificate',
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