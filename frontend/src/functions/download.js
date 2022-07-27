import { StorageContractAddress } from '../constants/constants.js';
import StorageAbi from '../artifacts/contracts/byteStorage.sol/ByteStorage.json';
const ethers = require('ethers');

let contract;

async function downloadFileParts(_fileName, _fileArrayIndex, _fileArrayBegin, _fileArrayEnd, setDownloadedFileParts, setStatus2, setStatus3) {

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

export async function downloadFile(fileName, setFileExtension, setDownloadedFileParts, setLoading, setStatus, setStatus2, setStatus3, setBase64string, provider) {

    console.log(StorageAbi.abi);
    console.log(StorageContractAddress);
    contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, provider)
    console.log('Downloading file: ' + fileName);

    let metadata = await contract.getFileInfo(fileName);

    setDownloadedFileParts([]);
    setBase64string("");
    let linkSpot = document.getElementById("linkSpot");
    if (document.getElementById('download-link')) {
        linkSpot.removeChild(document.getElementById('download-link'));
    }
    if (metadata[0] === "No File Found for that Name") {
        setStatus("File not found");
        return;
    }
    setFileExtension(metadata[1]);
    setLoading(true);
    setStatus("Downloading file: " + fileName + "." + metadata[1]);

    let fileArrayLength = metadata[2];
    let fileFinalPartLength = metadata[3];
    if (fileArrayLength > 1) {
        for (let i = 0; i < fileArrayLength - 1; i++) {
            await downloadFileParts(fileName, i, i * 10000, (i + 1) * 10000, setDownloadedFileParts, setStatus2, setStatus3);
        }
        await downloadFileParts(fileName, fileArrayLength - 1, (fileArrayLength - 1) * 10000, (fileArrayLength - 1) * 10000 + fileFinalPartLength, setDownloadedFileParts, setStatus2, setStatus3);
    } else {
        await downloadFileParts(fileName, 0, 0, fileFinalPartLength - 1, setDownloadedFileParts, setStatus2, setStatus3);
    }
    setLoading(false);
    setStatus("Download Complete.");
}

export function encodeFile(downloadedFileParts, fileName, fileExtension, setStatus, setLoading, setBase64string) {

    if (downloadedFileParts.length === 0) {
      setStatus("No file downloaded");
      return;
    }
    setLoading(true);

    // flatten the downloaded array
    let flatArray = downloadedFileParts.reduce((acc, cur) => acc.concat(cur), []);
    // convert each element to uint8Array
    let uint8Array = flatArray.map(element => ethers.utils.arrayify(element));
    // convert the newUint8Array to a file
    let file = new File(uint8Array, fileName, { type: 'application/octet-stream' });

    console.log(file);

    // link to download the file
    let link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = fileName + '.' + fileExtension;
    link.id = 'download-link';
    link.innerHTML = 'Download File';
    // append to linkSpot
    let linkSpot = document.getElementById('linkSpot');
    if (document.getElementById('download-link')) {
      linkSpot.removeChild(document.getElementById('download-link'));
      setBase64string("");
    }
    linkSpot.appendChild(link);

    // link.click();

    // create a base64 string from File
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {

      let firstChar = reader.result.at(reader.result.indexOf(',') + 1);
      // console.log(firstChar);
      let content = reader.result.split(',')[1];
      let dataType;

      if (firstChar === 'i') {
        dataType = 'image/png';
      } else if (firstChar === 'd') {
        dataType = 'application/pdf';
      } else if (firstChar === 't') {
        dataType = 'text/plain';
      } else if (firstChar === 'S') {
        dataType = 'audio/wav';
      } else if (firstChar === 'W') {
        dataType = 'audio/webm';
      }

      let header = `data:${dataType};base64,`;
      setBase64string(header + content);
    }

    setLoading(false);

  }