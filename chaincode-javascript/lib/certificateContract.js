'use strict';


// The CreateCertificate function allows a certificate provider to create a new certificate for a student.

// The ShareCertificate function allows a student to mark their certificate as shared.

// The VerifyCertificate function allows the certificate provider to verify a certificate. Only the certificate provider is authorized to perform this action.

// The ReadCertificate and CertificateExists functions are utility functions to read a certificate and check if it exists




const { Contract } = require('fabric-contract-api');

class CertificateContract extends Contract {

    async InitLedger(ctx) {
        // This function can be used to initialize the ledger with any default data if needed.
    }

    

  




    async CreateCertificate(ctx, data) {
        const inputData = JSON.parse(data);
        const {
            fileHash,
            IssueDate,
            certID,
            universityName,
            universityPK,
            issuingOfficerPK,
            studentPK,
            course
        } = inputData;
    
        // Check if the certificate already exists
        const exists = await this.CertificateExists(ctx, certID);
        if (exists) {
            throw new Error(`Certificate for student ${certID} already exists`);
        }
    
        const certificate = {
            fileHash,
            IssueDate,
            certID,
            universityName,
            universityPK,
            issuingOfficerPK,
            studentPK,
            course,
            shared:[]
        };
    
        // Store the certificate in the world state
        await ctx.stub.putState(certID, Buffer.from(JSON.stringify(certificate)));
    
        return JSON.stringify(certificate);
    }

    async ShareCertificate(ctx, data) {

        const inputData = JSON.parse(data);
        const certID = inputData.certID;
        const sharedWith = inputData.sharedWith;

        const exists = await this.CertificateExists(ctx, certID);
        if (!exists) {
            throw new Error(`Certificate for student ${certID} does not exist`);
        }

        // Get the current certificate
        const existingCertificate = await this.ReadCertificate(ctx, certID);
        
        // Update the certificate to mark it as shared
        certificate.shared.push(sharedWith);

        // Store the updated certificate in the world state
        await ctx.stub.putState(certID, Buffer.from(JSON.stringify(existingCertificate)));

        return JSON.stringify(existingCertificate);
    }



    // async VerifyCertificate(ctx, data) {

    //     const inputData = JSON.parse(data);
    //     const certID = inputData.certID;
    //     const verifierID = inputData.verifierID;
       
       
    //     // Check if the certificate exists
    //     const exists = await this.CertificateExists(ctx, certID);
    //     if (!exists) {
    //         throw new Error(`Certificate for student ${certID} does not exist`);
    //     }

    //     // Get the current certificate
    //     const existingCertificate = await this.ReadCertificate(ctx, certID);

    //     // Check if the verifier is authorized
    //     if (verifierID !== existingCertificate.ProviderID) {
    //         throw new Error(`Unauthorized verifier. Only the certificate provider can verify the certificate.`);
    //     }

    //     // Update the certificate to mark it as verified
    //     existingCertificate.Verified = true;

    //     // Store the updated certificate in the world state
    //     await ctx.stub.putState(certID, Buffer.from(JSON.stringify(existingCertificate)));

    //     return JSON.stringify(existingCertificate);
    // }

    async ReadCertificate(ctx, data) {
        // Parse the incoming data
        const inputData = JSON.parse(data);
    
        // Extract the certID from the parsed data
        const certID = inputData.certID;
    
        // Check if data has the certID property
        const certificateJSON = await ctx.stub.getState(certID);
        if (!certificateJSON || certificateJSON.length === 0) {
            rerun (`Certificate for student ${certID} does not exist`);
            throw new Error(`Certificate for student ${certID} does not exist`);
        }
        
        return JSON.parse(certificateJSON.toString());
    }
    
    async CertificateExists(ctx, certID) {

        const certificateJSON = await ctx.stub.getState(certID);
        return certificateJSON && certificateJSON.length > 0;
    }


    

    async Demo(ctx) {
        return "hi hello";
    }

}

module.exports = CertificateContract;
