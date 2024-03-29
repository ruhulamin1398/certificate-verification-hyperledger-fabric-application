/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

  
    async InitLedger(ctx) {
        // This function can be used to initialize the ledger with any default data if needed.
    }

    async CreateCertificate(ctx, studentID, studentName, providerID, providerName, course, issueDate) {
        // Check if the certificate already exists
        const exists = await this.CertificateExists(ctx, studentID);
        if (exists) {
            throw new Error(`Certificate for student ${studentID} already exists`);
        }

        // Create a new certificate object
        const certificate = {
            StudentID: studentID,
            StudentName: studentName,
            ProviderID: providerID,
            ProviderName: providerName,
            Course: course,
            IssueDate: issueDate,
            Shared: false,
            Verified: false,
        };

        // Store the certificate in the world state
        await ctx.stub.putState(studentID, Buffer.from(JSON.stringify(certificate)));

        return JSON.stringify(certificate);
    }

    async ShareCertificate(ctx, studentID) {
        // Check if the certificate exists
        const exists = await this.CertificateExists(ctx, studentID);
        if (!exists) {
            throw new Error(`Certificate for student ${studentID} does not exist`);
        }

        // Get the current certificate
        const existingCertificate = await this.ReadCertificate(ctx, studentID);
        
        // Update the certificate to mark it as shared
        existingCertificate.Shared = true;

        // Store the updated certificate in the world state
        await ctx.stub.putState(studentID, Buffer.from(JSON.stringify(existingCertificate)));

        return JSON.stringify(existingCertificate);
    }

    async VerifyCertificate(ctx, verifierID, studentID) {
        // Check if the certificate exists
        const exists = await this.CertificateExists(ctx, studentID);
        if (!exists) {
            throw new Error(`Certificate for student ${studentID} does not exist`);
        }

        // Get the current certificate
        const existingCertificate = await this.ReadCertificate(ctx, studentID);

        // Check if the verifier is authorized
        if (verifierID !== existingCertificate.ProviderID) {
            throw new Error(`Unauthorized verifier. Only the certificate provider can verify the certificate.`);
        }

        // Update the certificate to mark it as verified
        existingCertificate.Verified = true;

        // Store the updated certificate in the world state
        await ctx.stub.putState(studentID, Buffer.from(JSON.stringify(existingCertificate)));

        return JSON.stringify(existingCertificate);
    }

    async ReadCertificate(ctx, studentID) {
        const certificateJSON = await ctx.stub.getState(studentID);
        if (!certificateJSON || certificateJSON.length === 0) {
            throw new Error(`Certificate for student ${studentID} does not exist`);
        }
        return JSON.parse(certificateJSON.toString());
    }

    async CertificateExists(ctx, studentID) {
        const certificateJSON = await ctx.stub.getState(studentID);
        return certificateJSON && certificateJSON.length > 0;
    }
    async Demo(ctx) {
        return "hi";
    }
}

module.exports = AssetTransfer;
