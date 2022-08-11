import StorageAbi from '../ByteStorage.json';
const ethers = require('ethers');
const StorageContractAddress = "0x04BD1EAA738f1F79be86fAF63E79f1809Ac6C12D";

let contract;

let fileExtension;

let downloadedFileParts = [];

async function downloadFileParts(_fileName, _fileArrayIndex, _fileArrayBegin, _fileArrayEnd, setDownloadedFileParts, setStatus) {
    console.log("Downloading File Part: " + _fileArrayIndex + " from " + _fileArrayBegin + " to " + _fileArrayEnd);
    setStatus("Downloading File Part: " + _fileArrayIndex + " from " + _fileArrayBegin + " to " + _fileArrayEnd);

    for (let i = 0; i < _fileArrayEnd - _fileArrayBegin; i += 500) {

        let endIndex = _fileArrayBegin + i + 500 < _fileArrayEnd ? i + 500 : _fileArrayEnd - _fileArrayBegin;
        console.log("Downloading File Part: From " + i + " to " + endIndex);
        setStatus("Downloading File Part: From " + i + " to " + endIndex);
        let transaction = await contract.functions.getFileArray(_fileName, _fileArrayIndex, i, endIndex);
        downloadedFileParts.push(transaction[0]);
        setDownloadedFileParts(downloadedFileParts);
        // setDownloadedFileParts(prevState => [...prevState, transaction[0]]);

    }
    setStatus("");
}

export async function downloadFile(fileName, setDownloadedFileParts, setContentElement, setStatus, provider) {

    contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, provider)
    console.log('Downloading file: ' + fileName);

    let metadata = await contract.getFileInfo(fileName);

    downloadedFileParts = [];
    setDownloadedFileParts(downloadedFileParts);
    // setContentElement(<p>File Content</p>);
    setContentElement(null);
    let linkSpot = document.getElementById("linkSpot");
    // remove hidden className
    linkSpot.classList.remove("hidden");
    if (document.getElementById('download-link')) {
        linkSpot.removeChild(document.getElementById('download-link'));
    }
    if (metadata[0] === "No File Found for that Name") {
        setStatus("File not found");
        return;
    }
    fileExtension = metadata[1];
    setStatus("Downloading file: " + fileName + "." + metadata[1]);

    let fileArrayLength = metadata[2];
    let fileFinalPartLength = metadata[3];
    if (fileArrayLength > 1) {
        for (let i = 0; i < fileArrayLength - 1; i++) {
            await downloadFileParts(fileName, i, i * 10000, (i + 1) * 10000, setDownloadedFileParts, setStatus);
        }
        await downloadFileParts(fileName, fileArrayLength - 1, (fileArrayLength - 1) * 10000, (fileArrayLength - 1) * 10000 + fileFinalPartLength, setDownloadedFileParts, setStatus);
    } else {
        await downloadFileParts(fileName, 0, 0, fileFinalPartLength - 1, setDownloadedFileParts, setStatus);
    }
    setStatus("Download Complete.");
    encodeFile(downloadedFileParts, fileName, setStatus, setContentElement);
}

export function encodeFile(downloadedFileParts, fileName, setStatus, setBase64string) {

    if (downloadedFileParts.length === 0) {
      setStatus("No file downloaded");
      return;
    }

    let flatArray = downloadedFileParts.reduce((acc, cur) => acc.concat(cur), []);
    let uint8Array = flatArray.map(element => ethers.utils.arrayify(element));
    let file = new File(uint8Array, fileName, { type: 'application/octet-stream' });

    console.log(file);

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

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {

      let firstChar = reader.result.at(reader.result.indexOf(',') + 1);
      console.log(firstChar);
      let content = reader.result.split(',')[1];
      let dataType;
      let contentElement;

      if (firstChar === 'i') {
        dataType = 'data:image/png;base64,' + content;
        contentElement = <img src={dataType} alt="File Content" />;
      } else if (firstChar === 'd') {
        dataType = 'data:application/pdf;base64,' + content;
        contentElement = <iframe src={dataType} title="File Content" />;
      } else if (firstChar === 't') {
        dataType = 'data:text/plain;base64,' + content;
        contentElement = <textarea value={dataType} />;
      } else if (firstChar === 'S') {
        dataType = 'data:audio/wav;base64,' + content;
        contentElement = <audio controls src={dataType} />;
      } else if (firstChar === 'R') {
        dataType = 'data:image/gif;base64,' + content;
        contentElement = <img src={dataType} alt="File Content" />;
      } else if (firstChar === '/') {
        dataType = 'data:image/jpeg;base64,' + content;
        contentElement = <img src={dataType} alt="File Content" />;
      }

      setBase64string(contentElement);
    }

  }