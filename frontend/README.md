# ChainLoader <picture> <img alt="Matic Icon" width="30" src="src/matic-token-icon.svg"> </picture>

ChainLoader is a file storage application designed for use with the [Polygon](https://polygon.technology/) blockchain.

It is deployed at [https://storage-dapp.herokuapp.com](https://storage-dapp.herokuapp.com).

The motivation of this app was to create a proof of concept of the possibility of uploading relatively large, commonly used types of files to the Polygon blockchain. Since the data stored in the Polygon blockchain is immutable, this app essentially allows for the permanent storage of files. While this is not a secure solution, the proof of concept is there. This implementation calls a contract deployed on the Polygon blockchain due to the significantly lower gas costs, however, everything involved in this application could be theoretically deployed to a different blockchain, including Ethereum Mainnet. 

Features include:

- File storage and retrieval
- Optimized transaction costs
- Simplified process for file templating and division

## How it works

Information stored on the blockchain is immutable. This means that once a transaction is sent, it and the data it contains cannot be changed.  This application is a proof of concept for uploading entire files to the blockchain.  The first barrier when considering this problem is the Block Gas Limit. This is the maximum amount of gas that can be used in a single block. It fluctuates with network demands, and as of writing stands at around 30,000,000 gas, with a target of 15,000,000 gas ([source](https://blog.bitmex.com/ethereums-new-1mb-blocksize-limit/)). This means that you could theoretically create a transaction that consumes all of the gas in a single block. In practice, this would be nearly impossible, due to network activity and gas price fluctuation. This limit essentially caps the amount of bytes that can be included in a single transaction.  To work around this, we split the file into smaller chunks, and upload each chunk in a separate transaction.  Due to the block gas limit, and thus transaction gas limit, we can't create a single array that stores all of the chunks.  Instead, the files are stored in 2-dimensional arrays. The first dimension stores several large arrays, each one allocated to the maximum size possible in a single transaction.  Each one of those arrays is then filled with the data of the file, split into several transactions.  In summary, the upload process is as follows:
1. Create the file template - an array of a small size, each element to be set to an array of an extremely large size.
- This step also uploads metadata, including file name, file size, and file hash.
2. Create the individual arrays. Due to the size of each array, we must separate the creation of each into its own transaction.
3. Upload the file chunks. This consists of many transactions, each one uploading a chunk of the file to a specific array in the list of arrays. This step consists of the most transactions, and with a 3MB file, it could take up to 70-80 transactions to upload the file.
- The gas to upload the chunks can actually be estimated - however, it is not possible to estimate that cost before the arrays are created. This is because the chunk storage locations must be allocated before they are tested for transaction cost.

## Notes

* The app is currently in development.
* The app is designed to be used with a contract deployed on the [Polygon](https://polygon.technology/) network.
* Downloading files does not require a crypto wallet, as the Polygon RPC URI is used as the node/access point for the smart contract calls.
* Extensive tutorials are accessible within the app.

### File Structure

    .
    ├── backend                 # Backend code
    |   ├── contracts            # Contracts
    |   |   ├── byteStorage.sol   # Byte Storage Contract source code
    |   ├── scripts              # Scripts for deployment
    |   ├── test                 # Contract tests
    ├── frontend                # The React-based frontend used to interact with the contract
    │   ├── src                  # The source code for the frontend
    │   └── ...                 # etc.
    ├── local-scripts           # Local scripts for local contract interaction
    │   ├── inputs               # Sample Inputs
    │   ├── outputs              # Sample Outputs
    │   ├── *.py                 # Python scripts
    │   ├── requirements.txt     # Requirements file for python modules
    ├── README.md               # This file
    └── ...                     # etc.

### Technologies Used

* [React](https://reactjs.org/)
* [React Router](https://reacttraining.com/react-router/web/guides/quick-start)
* [Ethers.js](https://www.npmjs.com/package/ethers)
* [Tailwind CSS](https://tailwindcss.com/)
* [Headless UI](https://headlessui.com/)

### To-Do

- [ ] Finish Implementing the Upload Functionality
- [ ] Add Visualization of the File Structure on-chain (using 2d array)
- [ ] Add Testing
- [ ] Add Code Documentation
- [ ] Increase Contract Security (file hash as name, name-checking, password/signing protection)
- [ ] Add Download for Local Uploader Python script, for automated transacting

### Contact

You can contact me at [jpm6qjz@virginia.edu](mailto:jpm6qjz@virginia.edu).