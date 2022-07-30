import { StorageContractAddress } from '../constants/constants.js';
import StorageAbi from '../artifacts/contracts/byteStorage.sol/ByteStorage.json';
const ethers = require('ethers');

export async function estimateNewFileGas(fileName, fileExtension, fileLength, provider) {

    let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, provider)
    console.log('Uploading file: ' + fileName);

    let createFileCost = await contract.estimateGas.newFileTemplate(fileName, fileExtension, fileLength);
    let gasPrice = await provider.getGasPrice();

    // convert gas to ether
    let createFileCostInEther = ethers.utils.formatEther(createFileCost * gasPrice);

    console.log('File Cost Estimate: ' + createFileCostInEther + " Matic");
    return createFileCostInEther;
}

export async function createNewFile(fileName, fileExtension, fileLength, provider) {
    let signer = provider.getSigner();
    let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, signer)
    let transaction = await contract.newFileTemplate(fileName, fileExtension, fileLength);
    console.log('File Created: ' + fileName);
    return transaction;
}

export async function createNewFileArrays(fileName, fileLength, fileFinalArrayLength, provider) {
    let signer = provider.getSigner();
    let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, signer)

    if (fileLength > 0) {
        for (let i = 11; i < fileLength - 1; i++) {
            let transaction = await contract.newFileArray(fileName, i, 10000);
            console.log('File Array Created: ' + fileName + " " + i);
        }
        let transaction = await contract.newFileArray(fileName, fileLength - 1, fileFinalArrayLength);
        console.log('File Array Created: ' + fileName + " " + fileLength - 1);
    } else {
        let transaction = await contract.newFileArray(fileName, 0, fileFinalArrayLength);
        console.log('File Array Created: ' + fileName + " " + 0);
    }
}

export async function uploadNewFileEstimateGas(fileName, fileParts, provider, setCompletion) {
    let arrayIndex = 0;
    let startIndex;
    let endIndex;
    let count = 0;

    let signer = provider.getSigner();
    // let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, provider)
    let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, signer)

    let totalGas = 0;

    // map each element in each file part to hexlify
    let filePartsHex = fileParts.map(filePart => {
        let filePartHex = filePart.map(filePartElement => {
            // return ethers.utils.hexlify(filePartElement);
            return ethers.utils.hexZeroPad(ethers.utils.hexlify(filePartElement), 32);
        }
        );
        return filePartHex;
    });

    console.log('File Parts: ' + fileParts.length);
    console.log('File Parts Hex Length: ' + filePartsHex.length);

    for (let i = 0; i < fileParts.length; i++) {

        setCompletion(Math.floor((i / fileParts.length) * 100));

        startIndex = count * 500;
        endIndex = startIndex + fileParts[i].length;

        // console.log('Array Index: ' + arrayIndex);
        // console.log('Indexing from: ' + startIndex + ' to ' + endIndex);
        // console.log('Uploading ' + filePartsHex[i].length + ' size data in a ' + (endIndex - startIndex) + ' size spot');

        let gas_limit = await contract.estimateGas.setFileArray(fileName, arrayIndex, startIndex, endIndex, filePartsHex[i]);
        let gas_price = await provider.getGasPrice();

        let gas_estimate = ethers.BigNumber.from(gas_limit).mul(ethers.BigNumber.from(gas_price));
        // console.log('Gas Estimate: ' + gas_estimate.toString());
        totalGas += parseFloat(ethers.utils.formatEther(gas_estimate));
        // console.log('Total Gas Estimate: ' + totalGas + " Matic");

        count++;
        if (count === 20) {
            arrayIndex++;
            count = 0;
        }
    }

    setCompletion(100);

    // convert gas to ether
    // let totalGasInEther = ethers.utils.formatEther(totalGas);
    // let totalGasInEther = totalGas;


    // console.log('File Cost Estimate: ' + totalGasInEther + " Matic");
    return totalGas;

}

export async function getFileInfo(fileName, provider) {
    fileName = fileName.split(".")[0];
    let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, provider)
    let fileInfo = await contract.functions.getFileInfo(fileName);
    return fileInfo;
}

export async function uploadNewFile(fileName, fileParts, provider, setCompletion) {
    let arrayIndex = 0;
    let startIndex;
    let endIndex;
    let count = 0;

    let signer = provider.getSigner();
    let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, signer)

    let filePartsHex = fileParts.map(filePart => {
        let filePartHex = filePart.map(filePartElement => {
            return ethers.utils.hexZeroPad(ethers.utils.hexlify(filePartElement), 32);
        });
        return filePartHex;
    });

    for (let i = 0; i < fileParts.length; i++) {

        setCompletion(Math.floor((i / fileParts.length) * 100));
        startIndex = count * 500;
        endIndex = startIndex + fileParts[i].length;
        let transaction = await contract.setFileArray(fileName, arrayIndex, startIndex, endIndex, filePartsHex[i]);
        console.log(transaction);

        count++;
        if (count === 20) {
            arrayIndex++;
            count = 0;
        }
    }
    setCompletion(100);
}
