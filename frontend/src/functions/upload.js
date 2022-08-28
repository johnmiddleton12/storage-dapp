import StorageAbi from '../ByteStorage.json'
const ethers = require('ethers')
const StorageContractAddress = '0x04BD1EAA738f1F79be86fAF63E79f1809Ac6C12D'

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
  console.log('Uploading file: ' + fileName)

  let createFileCost = await contract.estimateGas.newFileTemplate(
    fileName,
    fileExtension,
    fileLength
  )
  let gasPrice = ethers.BigNumber.from(await provider.getGasPrice())

  // convert gas to ether
  let createFileCostInEther = ethers.utils.formatEther(
    createFileCost.mul(gasPrice)
  )

  console.log('File Cost Estimate: ' + createFileCostInEther + ' Matic')
  return createFileCostInEther
}

export async function checkFileExists(file, provider) {
  let status = ''

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
    console.log(
      `File template does not exist on the blockchain, estimated Gas to create it: ${gas_estimate.substring(
        0,
        6
      )} Matic`
    )
    status =
      'File template does not exist on the blockchain, estimated Gas to create it: ' +
      gas_estimate.substring(0, 6) +
      ' Matic'
  } else {
    console.log('File Template Exists on the blockchain')
    status = 'File Template Exists on the blockchain'
    // TODO: this is not a permanent solution
    if (fileInfo[3] === 0) {
      let array_count = parseInt((fileParts.length * 500) / 10000) + 1
      console.log(
        'arrays have not been created, ' +
          array_count +
          ' arrays need to be created (each costs .3-.7 matic)'
      )
      status =
        status +
        ', arrays have not been created, ' +
        array_count +
        ' arrays need to be created (each costs .3-.7 matic)'
    } else {
      console.log('arrays have been created')
      status = status + ', arrays have been created'
    }
  }
  return status
}
