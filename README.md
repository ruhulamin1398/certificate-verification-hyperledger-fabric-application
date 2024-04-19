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



# API 


## 1. Initialize Network

```
    POST /init HTTP/1.1
    Host: localhost:4000

```
     
## 2. Add new Authority 

```
POST /add-authority HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Content-Length: 113

{
   "type":"authority",
   "name": "Ruhul amin",
   "authorityId":"ruhul",
   "otherInformation":"other "
    
}

```
## 3. Get all Authority 

```
GET /get-all-authorities HTTP/1.1
Host: localhost:4000

```



## 4. Add new University 

```
POST /create-university HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Content-Length: 120

{
 "universityName":"Shahjalal University of Science & Technology (SUST)",
  "universityId":"sust",
  "status": 1
    
}

```



## 5. Get University 

```
GET /get-university/sust HTTP/1.1
Host: localhost:4000

```


## 6. Get all Universities 

```
GET /get-all-universities HTTP/1.1
Host: localhost:4000

```



## 7. Create Certificate

```
POST /create-certificate HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Content-Length: 168

{
        "IssueDate":"12-5-2024",
        "certID":"123",  
        "studentID":"bidyut",
        "course":"BSC in CSE ",
        "details":"write details here"
    
}

```



## 8. Get Certificate

```
GET /get-certificate/123 HTTP/1.1
Host: localhost:4000

```



## 9. Get all Certificate 

```
GET /get-all-certificates HTTP/1.1
Host: localhost:4000

```



## 3. Add Verifier 

```
POST /share-certificate HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Content-Length: 62

{
  "id":123,
  "shareWithID":"saif",
  "prefix":"cert"
    
}

```

