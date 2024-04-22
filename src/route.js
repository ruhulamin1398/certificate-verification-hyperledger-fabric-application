const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bodyParser = require('body-parser');

const { generateHash } = require("./controllers/certificateController.js")




const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const {loginUserAccount} = require("../user.js")
const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = loginUserAccount;

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
                console.error('Error submitting transaction:', error.message.toString());


                const errmsg = error.message.toString();
                return errmsg
                throw new Error('An error occurred'); // Throw the error message

            }





        } finally {
            gateway.disconnect();

        }
    } catch (error) {
        console.error(`Failed to get instantiated chaincodes: ${error}`);
    }

 
    return JSON.parse(result.toString());
}













router.post("/init", asyncHandler(async (req, res) => {
    const data = {
        "type": "authority"
    }



    const result = await SubmitTX("initLedger", data)
    res.json({
        "data": (result)
    });




}));




// *!   Authority Section


// university section 
router.post("/add-authority", asyncHandler(async (req, res) => {
    const data = {
        name,
        authorityId,
        otherInformation
    } = req.body;


    const result = await SubmitTX("addAuthorityMember", data)
    res.json({
        // "msg": "Authority added  successfully",
        "output": (result)
    });



}));


router.route("/get-all-authorities").get(async (req, res, next) => {
    const data = {
        "type": "authority"
    }


    const result = await SubmitTX("GetAllAssets", data)

    res.json({
        "output": (result)
    });




});






// *! university section 

router.post("/create-university", asyncHandler(async (req, res) => {
    const data = { universityName, universityId, status } = req.body;




    const result = await SubmitTX("CreateUniversity", data)
    res.json({
        // "msg": "University Created successfully",
        "output": result
    });



}));



// GET Single University
router.get("/get-university/:id", asyncHandler(async (req, res) => {
    const id = req.params.id;

    const data = { id, "prefix": "uni" }



    try {

        const result = await SubmitTX("ReadAsset", data)
        res.json({ result });
        res.json({
            "output": result
        });


    } catch (error) {

        res.status(400).json({
            "msg": " University doesn't exist !!!!!!!!!!!!!"
        });

    }


}));



// *! GET All universities
router.route("/get-all-universities").get(async (req, res, next) => {
    const data = {
        "type": "university"
    }


    try {

        const result = await SubmitTX("GetAllAssets", data)
        res.json({
            "universities": (result)
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
    let data = {
        IssueDate,
        certID,
        studentID,
        course,
        details
    } = req.body;
    const fileHash = await generateHash(data);
    data.fileHash = fileHash;
   



    try {

        const result = await SubmitTX("CreateCertificate", data)
        console.log("res " + result);
        res.json({
            // "msg": "Certificate Created successfully",
            "output": (result)
        });


    } catch (error) {


        res.status(400).json({
            "error": error.toString() // Return the error message or a default message
        });
    }

}));




router.post("/share-certificate", asyncHandler(async (req, res) => {

    const { id, shareWithID } = req.body;
    const data = {
        id, shareWithID, "prefix": "cert"
    }

    const result = await SubmitTX("ShareCertificate", data)
    res.json({
        "output": (result)
    });
}));



// VERIFY Certificate
// router.route("/verify-certificate/:verifierID/:studentID").put(async (req, res, next) => {
//     const result = await callBlockchain('VerifyCertificate', req.params.verifierID, req.params.studentID);
//     res.json(result);
// });



// GET Single Certificate
router.get("/get-certificate/:id", asyncHandler(async (req, res) => {
    const id = req.params.id;


    const data = { id, "prefix": "cert" }

    const result = await SubmitTX("getCertificate", data)
    res.json({
        "output": result
    });




}));


// GET All Certificates
router.route("/get-all-certificates").get(async (req, res, next) => {
    const data = {
        "type": "certificate"
    }



    const result = await SubmitTX("GetAllAssets", data)
    res.json({
        "output": result
    });



});


module.exports = router;


