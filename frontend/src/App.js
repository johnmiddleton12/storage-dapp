import './App.css';
import { useState } from 'react';
import StorageAbi from './artifacts/contracts/byteStorage.sol/ByteStorage.json';
const ethers = require('ethers');

const StorageContractAddress = "0x04BD1EAA738f1F79be86fAF63E79f1809Ac6C12D";

function App() {
  const [fileName, setFileName] = useState('');
  const [fileExtension, setFileExtension] = useState('');

  const [downloadedFileParts, setDownloadedFileParts] = useState([]);
  const [base64string, setBase64string] = useState('');

  const provider = new ethers.providers.Web3Provider(window.ethereum) || new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, provider)

  async function downloadFileParts(_fileName, _fileArrayIndex, _fileArrayBegin, _fileArrayEnd) {

    console.log("Downloading File Part: " + _fileArrayIndex + " from " + _fileArrayBegin + " to " + _fileArrayEnd);

    for (let i = 0; i < _fileArrayEnd - _fileArrayBegin; i += 500) {

      let endIndex = _fileArrayBegin + i + 500 < _fileArrayEnd ? i + 500 : _fileArrayEnd - _fileArrayBegin;
      console.log("Downloading File Part: From " + i + " to " + endIndex);
      let transaction = await contract.functions.getFileArray(_fileName, _fileArrayIndex, i, endIndex);
      // 500 at a time
        setDownloadedFileParts(prevState => [...prevState, transaction[0]]);

    }
  }

  async function downloadFile() {
    console.log('Downloading file: ' + fileName);
    let metadata = await contract.getFileInfo(fileName);
    setFileExtension(metadata[1]);
    let fileArrayLength = metadata[2];
    let fileFinalPartLength = metadata[3];
    setDownloadedFileParts([]);
    console.log('File Array Length: ' + fileArrayLength);
    if (fileArrayLength > 1) {
      for (let i = 0; i < fileArrayLength - 1; i++) {
        await downloadFileParts(fileName, i, i * 10000, (i + 1) * 10000)
      }
      await downloadFileParts(fileName, fileArrayLength - 1, (fileArrayLength - 1) * 10000, (fileArrayLength - 1) * 10000 + fileFinalPartLength)
    } else {
      await downloadFileParts(fileName, 0, 0, fileFinalPartLength - 1);
    }
  }

  function encodeFile() {

    // flatten the downloaded array
    let flatArray = downloadedFileParts.reduce((acc, cur) => acc.concat(cur), []);

    // convert each element to uint8Array
    let uint8Array = flatArray.map(element => ethers.utils.arrayify(element));

    console.log(flatArray);
    console.log(uint8Array);

    // convert the newUint8Array to a file
    let file = new File(uint8Array, fileName, { type: 'application/octet-stream' });

    console.log(file);

    // link to download the file
    let link = document.getElementById('download-link');
    
    link.href = URL.createObjectURL(file);
    link.download = fileName + '.' + fileExtension;
    link.hidden = false;

    // link.click();

    // create a base64 string from File
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {

      let firstChar = reader.result.at(reader.result.indexOf(',') + 1);
      console.log(firstChar);
      let content = reader.result.split(',')[1];
      console.log(content);
      let dataType;

      if (firstChar === 'i') {
        dataType = 'image/png';
      } else if (firstChar === 'd') {
        dataType = 'application/pdf';
      } else if (firstChar === 't') {
        dataType = 'text/plain';
      } else if (firstChar === 'S') {
        dataType = 'audio/wav';
      }

      let header = `data:${dataType};base64,`;

      setBase64string(header + content);

    }

  }

  return (
    <div className="App">
      <header className="App-header">
        <input onChange={e => setFileName(e.target.value)} placeholder="example.txt" />
        <button onClick={downloadFile}>Get Song</button>
        <br></br>
        <button onClick={encodeFile}>Encode File</button>
        <br></br>
        <p>{downloadedFileParts[0]}</p>
        { base64string ?
          <audio controls="controls" autobuffer="autobuffer" autoPlay="autoplay">
            <source src={`${base64string}`} />
          </audio>
          : null
        }
        <a id="download-link" href="" download="" hidden>Download File</a>
      </header>
    </div>
  );
}

export default App;