'use strict';


// The CreateCertificate function allows a certificate provider to create a new certificate for a student.

// The ShareCertificate function allows a student to mark their certificate as shared.

// The VerifyCertificate function allows the certificate provider to verify a certificate. Only the certificate provider is authorized to perform this action.

// The ReadCertificate and CertificateExists functions are utility functions to read a certificate and check if it exists




const { Contract } = require('fabric-contract-api');

class CertificateContract extends Contract {

    constructor() {
        super();
        this.flag = 0;
    }

    // Define initLedger function inside the constructor scope to make it effectively private
    async initLedger(ctx) {
        // Access flag using this.flag
        if (this.flag === 0) {
            const authorityId = await this.getCaller(ctx);
            
            const authority = {
                "type": "authority",
                "name": "Omar Saad",
                "issuedBy": authorityId,
                authorityId,
                "otherInformation": "Contract owner",
                "status": 1
            };

            const exists =await this.isExists(ctx, "aut" + authority.authorityId);
            if (!exists) {
               


        await ctx.stub.putState("aut" + authorityId, Buffer.from(JSON.stringify(authority)));


            }
            this.flag = 1;
            return authority;
        }
        else{
            throw new Error(`Already inititalized`);
        }
    }




    async addAuthorityMember(ctx, data) {
        const callerID = await this.getCaller(ctx);

        const isAuthorityMember = await this.isAuthority(ctx);
        if (!isAuthorityMember) {
            throw new Error("Only authority members ar allowed to perform this function");
        }

        
        const inputData = JSON.parse(data);
        const {
            name,
            authorityId,
            otherInformation
        } = inputData;

        // Check if the certificate already exists
        const exists = await this.isExists(ctx, "aut" + authorityId);
        if (exists) {
            throw new Error(` ${authorityId} already exists`);
        }

        const authority = {
            "type": "authority",
            name,
            authorityId,
            "issuedBy": callerID,
            otherInformation,
            "status": 1
        };


        await ctx.stub.putState("aut" + authorityId, Buffer.from(JSON.stringify(authority)));

        return JSON.stringify(authority);
    }






    async CreateUniversity(ctx, data) {

        const callerID = await this.getCaller(ctx);
        const isAuthorityMember = await this.isAuthority(ctx);
        if (!isAuthorityMember) {
            throw new Error("Only authority members ar allowed to perform this function");
        }


        const inputData = JSON.parse(data);
        const {
            universityName,
            universityId
        } = inputData;

        const exists = await this.isExists(ctx, "uni" + universityId);
        if (exists) {
            throw new Error(` ${universityId} already exists`);
        }

        const university = {
            "type": "university",

            "issuedBy": callerID,
            universityName,
            universityId,
            "status": 1
        };

        // Store the certificate in the world state
        await ctx.stub.putState("uni" + universityId, Buffer.from(JSON.stringify(university)));

        return JSON.stringify(university);
    }






    async CreateCertificate(ctx, data) {

        const callerID = await this.getCaller(ctx);
        const isUniversityAdmin = await this.isUniversityAdmin(ctx);
        if (!isAuthorityMember) {
            throw new Error("Only authority members ar allowed to perform this function");
        }




        const inputData = JSON.parse(data);
        const {
            fileHash,
            IssueDate,
            certID,  
            studentID,
            course,
            details
        } = inputData;

        // Check if the certificate already exists
        const exists = await this.isExists(ctx, "cert" + certID);
        if (exists) {
            throw new Error(`Certificate  ${"cert" + certID} already exists`);
        }

        const certificate = {
            "type": "certificate",
            "issuedBy": callerID,
            fileHash,
            IssueDate,
            certID,  
            studentID,
            course,
            details
        };

        // Store the certificate in the world state
        await ctx.stub.putState("cert" + certID, Buffer.from(JSON.stringify(certificate)));

        return JSON.stringify(certificate);
    }

    async getCertificate(ctx, data) {
        // Parse the incoming data
        const inputData = JSON.parse(data);
        const id = inputData.id;

        let data = { id, "prefix":"cert" }

        let certificate = await this.ReadAsset(ctx ,data )
        certificate =  JSON.parse(certificate.toString());

         

         data = { "id":await this.getIssuer(ctx, data), "prefix":"uni" }
        certificate.university= JSON.parse(await this.ReadAsset(ctx ,data ))
 
        return  certificate;
    }



    async ReadAsset(ctx, data) {
        // Parse the incoming data
        const inputData = JSON.parse(data);

        const prefix = inputData.prefix;
        const id = inputData.id;


        const exists = await this.isExists(ctx, prefix + id);
        if (!exists) {
            throw new Error(` ${id} doen't  exists`);
        }

        const assetJSON = await ctx.stub.getState(prefix + id);
 
        return JSON.parse(assetJSON.toString());
    }








    async GetAllAssets(ctx, data) {
        const inputData = JSON.parse(data);
        const type = inputData.type;

        if(type =="authority"){
            const isAuthorityMember = await this.isAuthority(ctx);
            if (!isAuthorityMember) {
                throw new Error("Only authority members ar allowed to perform this function");
            }
        }
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.type == type) {

                allResults.push(record);
            }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }





    async isExists(ctx, id) {

        const certificateJSON = await ctx.stub.getState(id);
        return certificateJSON && certificateJSON.length > 0;
    }

    async getCaller(ctx) {
        const identityString = ctx.clientIdentity.getID();
        const match = identityString.match(/CN=([^,]+)/);
        if (match && match[1]) {
            // Extract the username part
            const username = match[1].split("::")[0]; // Extracting before "::"
            return username;
        } else {
            throw new Error(`Somthing went wrong to get id `);
        }
    }
    async isAuthority(ctx){
        const callerID = await this.getCaller(ctx);
        const exists = await this.isExists(ctx, "aut" + callerID);
        if (exists) {
            return 1
        }
        else {
            return 0;
        }

    }


    async isUniversityAdmin(ctx){
        const callerID = await this.getCaller(ctx);
        const exists = await this.isExists(ctx, "uni" + callerID);
        if (exists) {
            return 1
        }
        else {
            return 0;
        }

    }

    async isOwner(ctx, data){
        

        const inputData = JSON.parse(data);
        const id = inputData.id;



        const exists = await this.isExists(ctx, "aut" + callerID);
        if (exists) {
            return 1
        }
        else {
            return 0;
        }

    }


    async getIssuer(ctx, data){
        

        const inputData = JSON.parse(data);
        const id = inputData.id;
        const prefix = inputData.prefix;

     
        const data = { id, prefix }
        const assetJSON = await this.ReadAsset(ctx ,data )
        const issuer = JSON.parse(assetJSON.toString());
        return issuer;

    }
    







}

module.exports = CertificateContract;
