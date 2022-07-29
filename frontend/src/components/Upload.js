import { useState } from "react";
import { Grid, Container, Typography } from "@mui/material";

import { Button } from "@mui/material";

import { createNewFile } from "../functions/upload";

export default function Upload({ provider }) {

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

    async function divideFileIntoParts() {
        let byteArray = new Uint8Array(await readFile(file));
        let chunks = [];
        for (let i = 0; i < byteArray.length; i += 32) {
            chunks.push(byteArray.slice(i, i + 32));
        }
        let chunks_parts = [];
        for (let i = 0; i < chunks.length; i += 500) {
            chunks_parts.push(chunks.slice(i, i + 500));
        }

        setFileParts(chunks_parts);
        console.log(chunks_parts);
    }

    async function createFile() {
        // calculate size and array count for new file
        // also extension
        // create and submit the transactions using load_url type function
        let file_name = file.name.split(".")[0];
        let file_extension = file.name.split(".")[1];
        createNewFile(file_name, file_extension, fileParts.length, provider);
    }

    async function uploadFile() {
        // for each element of fileParts, create a transaction and submit it
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
                        onClick={divideFileIntoParts}
                        variant="contained"
                        color="primary"
                    >
                        Encode File
                    </Button>
                </Container>
                <br />

                <Container justify="center" spacing={3}>
                    <Button type="submit"
                        onClick={createFile}
                        variant="contained"
                        color="primary"
                    >
                        Create File
                    </Button>
                </Container>


            </Container>
        </Grid>

    )
}