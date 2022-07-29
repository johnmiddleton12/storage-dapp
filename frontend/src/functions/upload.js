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
        for (let i = 0; i < fileLength - 1; i++) {
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

export async function uploadNewFileEstimateGas(fileName, fileParts, provider) {
    console.log('File Parts: ' + fileParts.length);
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
            return ethers.utils.hexlify(filePartElement);
        }
        );
        return filePartHex;
    });

    console.log('File Parts Hex Length: ' + filePartsHex.length);
    console.log('File Parts Hex[0] Length: ' + filePartsHex[0].length);

    // for (let i = 0; i < fileParts.length; i++) {
    for (let i = 0; i < 3; i++) {

        startIndex = count * 500;
        endIndex = startIndex + fileParts[i].length;

        console.log('Array Index: ' + arrayIndex);
        console.log('Indexing from: ' + startIndex + ' to ' + endIndex);

        // console.log('Uploading ' + fileParts[i].length + ' in a ' + (endIndex - startIndex) + ' size spot');

        // console.log('Uploading part: ' + filePartsHex[i]);
        console.log(fileName);
        let gas_estimate = await contract.estimateGas.setFileArray(fileName, arrayIndex, startIndex, endIndex, filePartsHex[i], { });
        let gas_price = await provider.getGasPrice();

        totalGas += gas_estimate * gas_price;

        count++;
        if (count === 20) {
            arrayIndex++;
            count = 0;
        }
    }

    // convert gas to ether
    let totalGasInEther = ethers.utils.formatEther(totalGas);

    console.log('File Cost Estimate: ' + totalGasInEther + " Matic");

}

export async function getFileInfo(fileName, provider) {
    fileName = fileName.split(".")[0];
    let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, provider)
    let fileInfo = await contract.functions.getFileInfo(fileName);
    return fileInfo;
}
