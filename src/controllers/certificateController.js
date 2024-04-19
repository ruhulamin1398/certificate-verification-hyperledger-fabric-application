const crypto = require('crypto');

const  generateHash = async (data)=>{

  const hash = crypto.createHash('sha256');

 hash.update(data.toString());
 


    return  hash.digest('hex');;
}

module.exports = {
    generateHash
  };