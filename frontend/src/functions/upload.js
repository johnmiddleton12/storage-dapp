import StorageAbi from '../artifacts/contracts/byteStorage.sol/ByteStorage.json'
import { StorageContractAddress } from '../constants/constants.js'
const ethers = require('ethers')

let fileName;
let fileExtension;
let fileLength;

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

  let fileParts = await divideFileIntoParts(file)

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