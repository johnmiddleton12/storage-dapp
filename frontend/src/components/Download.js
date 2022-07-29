import { useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/system/Container';
import { Grid, Typography } from '@mui/material';

import {downloadFile, encodeFile} from '../functions/download';

import DownloadForm from './DownloadForm';

export default function Download({ provider }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [status2, setStatus2] = useState("");
    const [status3, setStatus3] = useState("");

    const [fileName, setFileName] = useState('');
    const [fileExtension, setFileExtension] = useState('');

    const [downloadedFileParts, setDownloadedFileParts] = useState([]);
    const [base64string, setBase64string] = useState('');

    async function downloadFileMain() {
        await downloadFile(fileName, setFileExtension, setDownloadedFileParts, setLoading, setStatus, setStatus2, setStatus3, setBase64string, provider);
    }

    function decodeFile() {
        encodeFile(downloadedFileParts, fileName, fileExtension, setStatus, setLoading, setBase64string);
    }

    return (
        <>

            <DownloadForm downloadFileMain={downloadFileMain} fileName={fileName} setFileName={setFileName} loading={loading} />

            <Grid item xs={6}>
                <Container justify="center" spacing={1}>
                    <LoadingButton loading={loading}
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => {
                            decodeFile();
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

                <Container className="part-box" justify="center" spacing={3}>
                    {downloadedFileParts.length > 0 ?
                        <p className="part-display">
                            {downloadedFileParts.at(downloadedFileParts.length - 1).slice(0, 10)}<br />...<br />
                            {downloadedFileParts.at(downloadedFileParts.length - 1).slice(downloadedFileParts.at(downloadedFileParts.length - 1).length - 10, downloadedFileParts.at(downloadedFileParts.length - 1).length)}
                        </p>
                        : null}
                </Container>

                <br />
            </Grid>
        </>
    );
}