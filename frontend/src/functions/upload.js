import { StorageContractAddress } from '../constants/constants.js';
import StorageAbi from '../artifacts/contracts/byteStorage.sol/ByteStorage.json';
const ethers = require('ethers');

let contract;

async function uploadFileParts(_fileName, _fileArrayIndex, _fileArrayBegin, _fileArrayEnd, setDownloadedFileParts, setStatus2, setStatus3) {

    console.log("Downloading File Part: " + _fileArrayIndex + " from " + _fileArrayBegin + " to " + _fileArrayEnd);
    setStatus2("Downloading File Part: " + _fileArrayIndex + " from " + _fileArrayBegin + " to " + _fileArrayEnd);

    for (let i = 0; i < _fileArrayEnd - _fileArrayBegin; i += 500) {

        let endIndex = _fileArrayBegin + i + 500 < _fileArrayEnd ? i + 500 : _fileArrayEnd - _fileArrayBegin;
        console.log("Downloading File Part: From " + i + " to " + endIndex);
        setStatus3("Downloading File Part: From " + i + " to " + endIndex);
        let transaction = await contract.functions.getFileArray(_fileName, _fileArrayIndex, i, endIndex);
        setDownloadedFileParts(prevState => [...prevState, transaction[0]]);

    }
    setStatus2("");
}

export async function createNewFile(fileName, fileExtension, fileLength, provider) {

    contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, provider)
    console.log('Uploading file: ' + fileName);

    let createFileCost = await contract.estimateGas.newFileTemplate(fileName, fileExtension, fileLength);
    let gasPrice = await provider.getGasPrice();

    // convert gas to ether
    let createFileCostInEther = ethers.utils.formatEther(createFileCost * gasPrice);

    console.log('File Cost Estimate: ' + createFileCostInEther + " Matic");
}