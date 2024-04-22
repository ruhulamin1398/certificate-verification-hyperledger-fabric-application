'use strict';

 // *! Authority list 
 // *! their main responsibility to manage universities

// *! only authority member can manage authority list 


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
            const authorityId = "ruhul"

            const authority = {
                "name": "Omer Saad",
                "issuedBy": authorityId,
                authorityId,
                "otherInformation": "Contract owner",
                "status": 1,
                "type": "authority"
            };

            const exists = await this.isExists(ctx, "aut" + authority.authorityId);
            if (!exists) {



                await ctx.stub.putState("aut" + authorityId, Buffer.from(JSON.stringify(authority)));


            }
            this.flag = 1;
            return authority;
        }
        else {
            throw new Error(`Already inititalized`);
        }
    }


    

    async addAuthorityMember(ctx,   callerID  , name, authorityId, otherInformation) {

        const authority = {
            name,
            authorityId,
            "issuedBy": callerID,
            otherInformation,
            "status": 1,

            "type": "authority"
        };


        await ctx.stub.putState("aut" + authorityId, Buffer.from(JSON.stringify(authority)));

        return JSON.stringify(authority);
    }




    async GetAllAuthority(ctx ) { 

      
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
           

                allResults.push(record);
     
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
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

            "issuedBy": callerID,
            universityName,
            universityId,
            "status": 1,

            "type": "university"
        };

        // Store the certificate in the world state
        await ctx.stub.putState("uni" + universityId, Buffer.from(JSON.stringify(university)));

        return JSON.stringify(university);
    }






    async CreateCertificate(ctx, data) {

        const callerID = await this.getCaller(ctx);
        const isUniversityAdmin = await this.isUniversityAdmin(ctx);
        if (!isUniversityAdmin) {
            throw new Error("Only universities members ar allowed to perform this function");
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
            "issuedBy": callerID,
            fileHash,
            IssueDate,
            certID,
            studentID,
            course,
            details,

            "type": "certificate",
            "shareWith": []
        };

        // Store the certificate in the world state
        await ctx.stub.putState("cert" + certID, Buffer.from(JSON.stringify(certificate)));

        return JSON.stringify(certificate);
    }

    async getCertificate(ctx, data) {

        let certificate = await this.ReadAsset(ctx, data)
        certificate = JSON.parse(certificate.toString());

        if(await this.isIssuer(ctx,data) || await this.isCertificateHolderStudent(ctx,data)||await this.isSharedWith(ctx,data)){
         
            return certificate;
        }

        throw new Error(`You aren't allowed to view this certificate`);


        // else{
        //     throw new Error(`You aren't allowed to view this certificate`);
        // }
    }


    async ShareCertificate(ctx, data) {
        const { shareWithID, id } = JSON.parse(data);

        const isholder = await this.isCertificateHolderStudent(ctx, data)
        if (isholder) {

            let certificate = await this.ReadAsset(ctx, data)
            certificate = JSON.parse(certificate.toString());

            if (!certificate.shareWith.includes(shareWithID)) {
                certificate.shareWith.push(shareWithID);
            }       
            else {
                throw new Error(`Verifier already exist`);
    
            }
    

            await ctx.stub.putState("cert" + id, Buffer.from(JSON.stringify(certificate)));

            return JSON.stringify(certificate);



        }
        else {
            throw new Error(`Only certificate Holder student can share certificate`);

        }



    }




    async ReadAsset(ctx, data) {
        // Parse the incoming data
        const { prefix, id } = JSON.parse(data);

        // const prefix = inputData.prefix;
        // const id = inputData.id;


        const exists = await this.isExists(ctx, prefix + id);
        if (!exists) {
            throw new Error(` ${id} doen't  exists`);
        }

        const assetJSON = await ctx.stub.getState(prefix + id);

        const asset = JSON.parse(assetJSON.toString());
        return JSON.stringify(asset);
    }








    async GetAllAssets(ctx, data) {
        const inputData = JSON.parse(data);
        const type = inputData.type;

        if (type == "authority") {
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






    async GETAll(ctx) {

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


    async ReadData(ctx, id) {
  

        const exists = await this.isExists(ctx,id);
        if (exists) {
        	const assetJSON = await ctx.stub.getState(prefix + id);
        	const asset = JSON.parse(assetJSON.toString());
        	return JSON.stringify(asset);
        }
        else{
            throw new Error(`does not exist`);
        }
        


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
    async isAuthority(ctx) {
        const callerID = await this.getCaller(ctx);
        const exists = await this.isExists(ctx, "aut" + callerID);
        if (exists) {
            return 1
        }
        else {
            return 0;
        }

    }


    async isUniversityAdmin(ctx) {
        const callerID = await this.getCaller(ctx);
        const exists = await this.isExists(ctx, "uni" + callerID);
        if (exists) {
            return 1
        }
        else {
            return 0;
        }

    }

    async isIssuer(ctx, data) {

        const callerID = await this.getCaller(ctx);
        const assetJSON = await this.ReadAsset(ctx, data)
        const asset = JSON.parse(assetJSON.toString());

        if (asset.issuedBy == callerID) {
            return 1
        }
        else {
            return 0;
        }

    }
    async isCertificateHolderStudent(ctx, data) {

        const callerID = await this.getCaller(ctx);
        const assetJSON = await this.ReadAsset(ctx, data)
        const asset = JSON.parse(assetJSON.toString());

        if (asset.studentID == callerID) {
            return 1
        }
        else {
            return 0;
        }
    }

    async isSharedWith(ctx, data) {

        const callerID = await this.getCaller(ctx);
        const assetJSON = await this.ReadAsset(ctx, data)
        const asset = JSON.parse(assetJSON.toString());
  

        if(asset.shareWith.includes(callerID)){
            return 1; 
        }
        else {
            return 0;
        }
    }

    


    async getIssuer(ctx, data) {

        const assetJSON = await this.ReadAsset(ctx, data)
        const asset = JSON.parse(assetJSON.toString());


        const issuerdata = { "id": asset.issuedBy, "prefix": "uni" }
        const issuerjson = await this.ReadAsset(ctx, issuerdata)
        const issuer = JSON.parse(issuerjson.toString());
        return issuer;

    }








}

module.exports = CertificateContract;
