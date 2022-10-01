import StorageAbi from '../artifacts/contracts/byteStorage.sol/ByteStorage.json'
import { StorageContractAddress } from '../constants/constants.js'
const ethers = require('ethers')

let fileName;
let fileExtension;
let fileLength;
let fileParts;

// read the file into buffer
function readFile(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.addEventListener('loadend', e => resolve(e.target.result))
    reader.addEventListener('error', reject)
    reader.readAsArrayBuffer(file)
  })
}

// split file into chunks of 500 32-byte arrays
async function divideFileIntoParts(file) {
  let byteArray = new Uint8Array(await readFile(file))
  let chunks = []
  for (let i = 0; i < byteArray.length; i += 32) {
    chunks.push(byteArray.slice(i, i + 32))
  }
  let chunks_parts = []
  for (let i = 0; i < chunks.length; i += 500) {
    chunks_parts.push(chunks.slice(i, i + 500))
  }
  console.log('chunks_parts', chunks_parts)
  fileParts = chunks_parts
  return chunks_parts
}

// get file info, e.g., extension, array count, including if it exists
export async function getFileInfo(fileName, provider) {
  fileName = fileName.split('.')[0]
  let contract = new ethers.Contract(
    StorageContractAddress,
    StorageAbi.abi,
    provider
  )
  let fileInfo = await contract.functions.getFileInfo(fileName)
  return fileInfo
}

// estimate gas cost of creating a new file template
export async function estimateNewFileGas(
  fileName,
  fileExtension,
  fileLength,
  provider
) {
  let contract = new ethers.Contract(
    StorageContractAddress,
    StorageAbi.abi,
    provider
  )
  let createFileCost = await contract.estimateGas.newFileTemplate(
    fileName,
    fileExtension,
    fileLength
  )
  let gasPrice = ethers.BigNumber.from(await provider.getGasPrice())
  let createFileCostInEther = ethers.utils.formatEther(
    createFileCost.mul(gasPrice)
  )
  return createFileCostInEther
}

// check if file exists in storage contract, and return if
// the template or arrays exist, and possibly the estimate
// of creating them as well as the array count
export async function checkFileExists(file, provider) {

  // template exists, arrays exist, gas estimate, array count
  let status = [false, false, 0, 0]

  fileParts = await divideFileIntoParts(file)

  let file_name = file.name.split('.')[0]
  let fileInfo = await getFileInfo(file_name, provider)
  console.log(fileInfo)
  if (fileInfo[0] === 'No File Found for that Name') {
    let file_extension = file.name.split('.')[1]
    let file_array_count = parseInt((fileParts.length * 500) / 10000) + 1
    let gas_estimate = await estimateNewFileGas(
      file_name,
      file_extension,
      file_array_count,
      provider
    )

    fileName = file_name
    fileExtension = file_extension
    fileLength = file_array_count

    status = [false, false, gas_estimate.substring(0, 6)]
  } else {
    status[0] = true
    // TODO: this is not a permanent solution
    if (fileInfo[3] === 0) {
      let array_count = parseInt((fileParts.length * 500) / 10000) + 1
      status[1] = false
      status[3] = array_count
    } else {
      status[1] = true
    }

    let file_extension = file.name.split('.')[1]
    let file_array_count = parseInt((fileParts.length * 500) / 10000) + 1

    fileName = file_name
    fileExtension = file_extension
    fileLength = file_array_count

  }
  console.log(status)
  return status
}

// create a new file template
export async function createNewFileTemplate(provider) {
    let signer = provider.getSigner();
    let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, signer)
    let transaction = await contract.newFileTemplate(fileName, fileExtension, fileLength);
    console.log('File Created: ' + fileName);
    return transaction;
}

export async function createNewFileArrays(provider) {

  let fileFinalArrayLength = ((fileParts.length * 500) - 500 + (fileParts[fileParts.length - 1].length)) % 10000; 

    let signer = provider.getSigner();
    let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, signer)

    let transactions = [];

    if (fileLength > 0) {
        for (let i = 0; i < fileLength - 1; i++) {
            let transaction = await contract.newFileArray(fileName, i, 10000);
            transactions.push(transaction);
            console.log('File Array Created: ' + fileName + " " + i);
        }
        let transaction = await contract.newFileArray(fileName, fileLength - 1, fileFinalArrayLength);
        transactions.push(transaction);
        console.log('File Array Created: ' + fileName + " " + fileLength - 1);
    } else {
        let transaction = await contract.newFileArray(fileName, 0, fileFinalArrayLength);
        transactions.push(transaction);
        console.log('File Array Created: ' + fileName + " " + 0);
    }
    return transactions;
}

export async function uploadNewFileEstimateGas(provider) {

    let arrayIndex = 0;
    let startIndex;
    let endIndex;
    let count = 0;

    let signer = provider.getSigner();
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

        // setCompletion(Math.floor((i / fileParts.length) * 100));

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

    // setCompletion(100);

    // convert gas to ether
    // let totalGasInEther = ethers.utils.formatEther(totalGas);
    // let totalGasInEther = totalGas;


    // console.log('File Cost Estimate: ' + totalGasInEther + " Matic");
    return totalGas;

}

export async function uploadNewFile(provider) {

    let arrayIndex = 0;
    let startIndex;
    let endIndex;
    let count = 0;

    let transactions = [];

    let signer = provider.getSigner();
    let contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, signer)

    let filePartsHex = fileParts.map(filePart => {
        let filePartHex = filePart.map(filePartElement => {
            return ethers.utils.hexZeroPad(ethers.utils.hexlify(filePartElement), 32);
        });
        return filePartHex;
    });

    for (let i = 0; i < fileParts.length; i++) {

        // setCompletion(Math.floor((i / fileParts.length) * 100));
        startIndex = count * 500;
        endIndex = startIndex + fileParts[i].length;
        console.log('Array Index: ' + arrayIndex);
        console.log('Indexing from: ' + startIndex + ' to ' + endIndex);
        console.log('Uploading ' + filePartsHex[i].length + ' size data in a ' + (endIndex - startIndex) + ' size spot');
        let transaction = await contract.setFileArray(fileName, arrayIndex, startIndex, endIndex, filePartsHex[i]);
        transactions.push(transaction);
        console.log(transaction);

        count++;
        if (count === 20) {
            arrayIndex++;
            count = 0;
        }
    }
    // setCompletion(100);
    return transactions;
}
