const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}


async function SubmitTX(transactionName, data) {
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
            let result =" ";
            try {
                let result = await contract.submitTransaction(transactionName, JSON.stringify(data));
                console.log('Transaction submitted successfully. Result:', result.toString());
            } catch (error) {
                result = error.message;
                console.error('Error submitting transaction:', error.message);
            }

            


            result = Buffer.from(result, 'hex').toString('utf-8')

            console.log(result);
            return result;


        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`Failed to get instantiated chaincodes: ${error}`);
    }
}




// CREATE Certificate

//@desc Create new certificate
//@route POST /create-certificate
//@access pubic
 


router.post("/create-certificate", asyncHandler(async (req, res) => {
    const data = {
        studentID,studentName,providerID,providerName,course,issueDate} = req.body;

    const result = await SubmitTX("CreateCertificate", data)
     res.json({ result  });
}));


 

// GET SHARE Certificate
router.get("/share-certificate/:studentID", asyncHandler(async (req, res) => {
    const data = {studentID}=req.params;
    const result = await SubmitTX("ShareCertificate", data)
     res.json({ result  });
}));



// VERIFY Certificate
router.route("/verify-certificate/:verifierID/:studentID").put(async (req, res, next) => {
    const result = await callBlockchain('VerifyCertificate', req.params.verifierID, req.params.studentID);
    res.json(result);
});

// GET All Certificates
// router.route("/get-all-certificates").get(async (req, res, next) => {
//     const data = {
//         studentID,studentName,providerID,providerName,course,issueDate} = req.body;

//     const result = await SubmitTX("CreateCertificate", data)
//      res.json({ result  });
// });

// GET Single Certificate
router.get("/get-certificate/:studentID", asyncHandler(async (req, res) => {
    const data = {studentID}=req.params;
    const result = await SubmitTX("ReadCertificate", data)
     res.json({ result  });
}));




module.exports = router;


async function callBlockchain(transactionName, ...args) {
    return args;

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
            const channel = network.getChannel();
            // return channel;

            // return transactionName;

            console.log(`\n--> Evaluate/Submit Transaction: ${transactionName}`);
            // const result = await contract[transactionName](...args);
            const result = await contract["CreateCertificate"](...args);



            if (transactionName.startsWith('Get') || transactionName.startsWith('Read')) {
                return {
                    data: `${prettyJSONString(result.toString())}`
                };
            } else {
                console.log('*** Result: committed');
                return {
                    data: `${prettyJSONString(result.toString())}`
                };
            }
        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        return {
            error: `Failed to run the application: ${error}`
        };
    }
}
