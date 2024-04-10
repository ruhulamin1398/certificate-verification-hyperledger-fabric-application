const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../test-application/javascript/AppUtil.js');

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'omar2';

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}


async function SubmitTX(transactionName, data) {
    let result;
    try {
        const ccp = buildCCPOrg1();
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
        const wallet = await buildWallet(Wallets, walletPath);

        await enrollAdmin(caClient, wallet, mspOrg1);
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

        const gateway = new Gateway();


        try {
            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true }
            });

            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);


            // return  await contract.evaluateTransaction("Demo");



            try {
                // result = await contract.evaluateTransaction(transactionName, JSON.stringify(data));
                result = await contract.submitTransaction(transactionName, JSON.stringify(data));
                console.log('Transaction submitted successfully. Result:', result.toString());

            } catch (error) {
                console.error('Error submitting transaction:', error.message);
                throw new Error(error.message); // Throw the error message

            }





        } finally {
            gateway.disconnect();

        }
    } catch (error) {
        console.error(`Failed to get instantiated chaincodes: ${error}`);
    }
    return result.toString();
}





router.post("/init", asyncHandler(async (req, res) => {
    const data ={
        "type": "authority"
    }



    try {
         console.log("----------------")
        const result = await SubmitTX("initLedger", data)
        res.json({
            "msg": "Initialization Successfull",
            "data":JSON.parse(result)
        });

    } catch (error) {

        console.log("----------------")
        res.status(500).json({
            "msg": "Somethings went wrong !!!!!!!!!!!!!"
        });

    }

}));




// *!   Authority Section


// university section 
router.post("/add-authority", asyncHandler(async (req, res) => {
    const data = { 
        name,
        authorityId,
        otherInformation
    } = req.body;


    try {
         
        const result = await SubmitTX("addAuthorityMember", data)
        res.json({
            "msg": "Authority added  successfully",
            "authority": JSON.parse(result)
        });

    } catch (error) {

        res.status(500).json({
            "msg": " Something went wrong !!!!!!!!!!!!!"
        });

    }

}));


router.route("/get-all-authorities").get(async (req, res, next) => {
    const data ={
        "type": "authority"
    }


    try {
         
        const result = await SubmitTX("GetAllAssets",data)
      
        res.json({
            "authorities": JSON.parse(result)
        });

    } catch (error) {

        res.status(500).json({
            "msg": " Something went wrong !!!!!!!!!!!!!"
        });

    }

 
});






// CREATE Certificate

//@desc Create new certificate
//@route POST /create-certificate
//@access pubic



router.post("/create-certificate", asyncHandler(async (req, res) => {
    const data = { fileHash, IssueDate, certID, universityName, universityPK, issuingOfficerPK, studentPK, course } = req.body;



    try {
         
        const result = await SubmitTX("CreateCertificate", data)
        console.log("res " + result);
        res.json({
            "msg": "Certificate Created successfully",
            "certificate": JSON.parse(result)
        });
    

    } catch (error) {

        res.status(400).json({
            "msg": " Certificate already exist !!!!!!!!!!!!!"
        });

    }
    
}));




// GET SHARE Certificate
router.get("/share-certificate/", asyncHandler(async (req, res) => {
    const certID = { certID } = req.body;
    const sharedWith = { sharedWith } = req.body;
    const data = {
        certID, sharedWith
    }
    res.json({
        certID, sharedWith
    })
    const result = await SubmitTX("ShareCertificate", data)
    res.json({ result });
}));



// VERIFY Certificate
router.route("/verify-certificate/:verifierID/:studentID").put(async (req, res, next) => {
    const result = await callBlockchain('VerifyCertificate', req.params.verifierID, req.params.studentID);
    res.json(result);
});

// GET All Certificates
router.route("/get-all-certificates").get(async (req, res, next) => {
    const data ={
        "type": "certificate"
    }


    try {
         
        const result = await SubmitTX("GetAllAssets",data)
        res.json({
            "certificates": JSON.parse(result)
        });

    } catch (error) {

        res.status(500).json({
            "msg": " Something went wrong !!!!!!!!!!!!!"
        });

    }

 
});

// GET Single Certificate
router.get("/get-certificate/:id", asyncHandler(async (req, res) => {
    const id = req.params.id;

    const data = { id, "prefix":"cert" }



    try {
         
        const result = await SubmitTX("ReadAsset", data)
        //  res.json({ result  });
        res.json({
            "msg": "Certificate retrieved successfully",
            "certificate": JSON.parse(result)
        });
    

    } catch (error) {

        res.status(400).json({
            "msg": " Certificate doesn't exist !!!!!!!!!!!!!"
        });

    }

 
}));





// university section 
router.post("/create-university", asyncHandler(async (req, res) => {
    const data = { universityName, universityId, status } = req.body;


    try {
         
        const result = await SubmitTX("CreateUniversity", data)
        res.json({
            "msg": "University Created successfully",
            "university": JSON.parse(result)
        });

    } catch (error) {

        res.status(400).json({
            "msg": " University already exist !!!!!!!!!!!!!"
        });

    }

}));



// GET Single University
router.get("/get-university/:id", asyncHandler(async (req, res) => {
    const id = req.params.id;

    const data = { id, "prefix":"uni" }



    try {
         
        const result = await SubmitTX("ReadAsset", data)
        //  res.json({ result  });
        res.json({
            "msg": "University retrieved successfully",
            "certificate": JSON.parse(result)
        });
    

    } catch (error) {

        res.status(400).json({
            "msg": " University doesn't exist !!!!!!!!!!!!!"
        });

    }

 
}));



// GET All universities
router.route("/get-all-universities").get(async (req, res, next) => {
    const data ={
        "type": "authority"
    }


    try {
         
        const result = await SubmitTX("GetAllAssets",data)
        res.json({
            "universities": JSON.parse(result)
        });

    } catch (error) {

        res.status(500).json({
            "msg": " Something went wrong !!!!!!!!!!!!!"
        });

    }


  
});




module.exports = router;


