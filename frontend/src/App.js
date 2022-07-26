import './App.css';
import { useState } from 'react';
import StorageAbi from './artifacts/contracts/byteStorage.sol/ByteStorage.json';

import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/system/Container';
import { Grid, Typography } from '@mui/material';

import { StorageContractAddress } from './constants/constants.js';

const ethers = require('ethers');

function App() {

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [status2, setStatus2] = useState("");
  const [status3, setStatus3] = useState("");

  const [fileName, setFileName] = useState('');
  const [fileExtension, setFileExtension] = useState('');

  const [downloadedFileParts, setDownloadedFileParts] = useState([]);
  const [base64string, setBase64string] = useState('');

  const provider = new ethers.providers.Web3Provider(window.ethereum) || new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const contract = new ethers.Contract(StorageContractAddress, StorageAbi.abi, provider)

  async function downloadFileParts(_fileName, _fileArrayIndex, _fileArrayBegin, _fileArrayEnd) {

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

  async function downloadFile() {
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
        await downloadFileParts(fileName, i, i * 10000, (i + 1) * 10000)
      }
      await downloadFileParts(fileName, fileArrayLength - 1, (fileArrayLength - 1) * 10000, (fileArrayLength - 1) * 10000 + fileFinalPartLength)
    } else {
      await downloadFileParts(fileName, 0, 0, fileFinalPartLength - 1);
    }
    setLoading(false);
    setStatus("Download Complete.");
  }

  function encodeFile() {

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

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justify="center"
    >

      <Grid item
        style={{
          marginTop: '20px',
          marginBottom: '20px'
        }}
      >
        <Typography variant="h4">
          File Downloader
        </Typography>
      </Grid>

      <Grid item xs={6}>

        <Container
          justify="center"
          spacing={3}
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            downloadFile();
          }}>
            <TextField id="file-name" label="File Name" value={fileName} onChange={(e) => { setFileName(e.target.value) }} />
            <br />
            <Container justify="center" spacing={3}>
              <LoadingButton type="submit" loading={loading}
                variant="contained"
                color="primary"
                size="large"
                style={{ marginTop: '10px' }}
              >
                Download File
              </LoadingButton>
            </Container>
          </form>
        </Container>
      </Grid>

      <Grid item xs={6}>

        <Container justify="center" spacing={1}>
          <LoadingButton loading={loading}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              encodeFile();
            }}
          >
            Process File
          </LoadingButton>

        </Container>
      </Grid>
      {base64string ?
        <Grid item xs={12}>
          <Container justify="center" spacing={1}>
            <audio
              style={{
                margin: '5px'
              }}
              controls="controls" autobuffer="autobuffer" autoPlay="autoplay">
              <source src={`${base64string}`} />
            </audio>
          </Container>
        </Grid>
        : null
      }
      <Grid item xs={12}>
        <Container id="linkSpot" justify="center" spacing={1}>
        </Container>
      </Grid>

      <Grid item xs={12}>
        <Container justify="center" spacing={3}>
          <Typography variant="h6" color="primary">
            {status}
          </Typography>
          {status2 &&
            <div>
              <Typography variant="h7" color="primary">
                {status2}
              </Typography>
              <br />
              <Typography variant="h7" color="primary">
                {status3}
              </Typography>
            </div>
          }
        </Container>
        <br></br>


      </Grid>
      <Grid item xs={4}>
        <Container justify="center" spacing={1}>
          {downloadedFileParts.length > 0 &&
            <Typography variant="h7" >{`${downloadedFileParts.length} parts downloaded`}</Typography>
          }
        </Container>
      </Grid>
      <Grid item xs={6}>

        <Container justify="center" spacing={3}>
          {downloadedFileParts.length > 0 ?
            <p
              style={
                {
                  display: 'inline-block',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#00bcd4',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '5px',
                  padding: '10px',
                  margin: '10px',
                  border: '1px solid #00bcd4',
                  wordWrap: 'break-word',
                }}
            >{downloadedFileParts.at(downloadedFileParts.length - 1).slice(0, 10)}<br />...<br />
              {downloadedFileParts.at(downloadedFileParts.length - 1).slice(downloadedFileParts.at(downloadedFileParts.length - 1).length - 10, downloadedFileParts.at(downloadedFileParts.length - 1).length)}
            </p>
            : null}
        </Container>

        <br />
      </Grid>
    </Grid>
  );
}

export default App;