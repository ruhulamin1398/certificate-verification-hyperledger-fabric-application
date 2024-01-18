## View Ledger data from Peer

1. **Find the Docker Container ID:**

List all running Docker containers to find the ID of the peer container you are interested in:


    docker ps

2. **Access the Container's Filesystem:**

Once you have the Container ID, you can access its filesystem using the following command:


    docker exec -it <container_id> /bin/sh


2. **Navigate to Ledger Data:**

Inside the container, you can navigate to the directories where Hyperledger Fabric stores the ledger data. The default paths are often as follows:

**For the world state:**

    /var/hyperledger/production/ledgersData/stateLeveldb

**For the blockchain data:**

    <!-- Open folder -->
    cd /var/hyperledger/production/ledgersData/chains

    <!-- Read block data -->
    cat /var/hyperledger/production/ledgersData/chains/chains/mychannel/blockfile_000000
     






