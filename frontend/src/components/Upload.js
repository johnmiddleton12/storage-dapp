import { useState } from "react";
import { Grid, Container, Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import { Button } from "@mui/material";
import { logger } from "ethers";

export default function Upload() {

    const [file, setSelectedFile] = useState(null);

    const [fileParts, setFileParts] = useState([]);

    function readFile(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.addEventListener("loadend", e => resolve(e.target.result))
            reader.addEventListener("error", reject)
            reader.readAsArrayBuffer(file)
        })
    }

    async function encodeFile() {
        let byteArray = new Uint8Array(await readFile(file));
        console.log(byteArray);
    }

    return (
        <Grid item xs={6}>
            <Container
                justify="center"
                spacing={3}
            >
                <Container justify="center" spacing={3}>
                    <Typography variant="h5">
                        Selected File
                    </Typography>
                    {file ? <Typography variant="h7">{file.name}</Typography> : <Typography variant="h7">No file selected</Typography>}
                </Container>
                <br />

                <Container justify="center" spacing={3}>
                    <Button variant="contained" component="label" >
                        Select File
                        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} hidden />
                    </Button>
                </Container>
                <br />

                <Container justify="center" spacing={3}>
                    <Button type="submit"
                        onClick={encodeFile}
                        variant="contained"
                        color="primary"
                    >
                        Encode File
                    </Button>
                </Container>
                <br />

                <Container justify="center" spacing={3}>
                    <Button type="submit"
                        onClick={encodeFile}
                        variant="contained"
                        color="primary"
                    >
                        Upload File
                    </Button>
                </Container>


            </Container>
        </Grid>

    )
}