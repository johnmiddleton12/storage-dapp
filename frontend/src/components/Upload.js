import { useState, useEffect } from "react";
import { Grid, Container, Typography } from "@mui/material";

import { Button } from "@mui/material";

import { getFileInfo, createNewFile, estimateNewFileGas, uploadNewFileEstimateGas, createNewFileArrays } from "../functions/upload";

export default function Upload({ provider }) {

    const [file, setSelectedFile] = useState(null);

    const [fileExists, setFileExists] = useState("");

    // create an effect that runs on page load and when file changes
    // this effect will check if the file exists on the blockchain
    useEffect(() => {
        async function checkFileExists() {
            if (file) {
                await divideFileIntoParts();
                let file_name = file.name.split(".")[0];
                let fileInfo = await getFileInfo(file_name, provider);
                console.log(fileInfo);
                if (fileInfo[0] === "No File Found for that Name") {
                    let file_extension = file.name.split(".")[1];
                    let file_array_count = parseInt((fileParts.length * 500) / 10000) + 1;
                    let gas_estimate = await estimateNewFileGas(file_name, file_extension, file_array_count, provider);
                    console.log(gas_estimate);
                    setFileExists(<p>File template does not exist on the blockchain<br />Estimated Gas to create it: {gas_estimate.substring(0, 6)} Matic</p>);
                } else {
                    setFileExists("File Template Exists on the blockchain");
                }
            } else {
                setFileExists("");
            }
        }
        checkFileExists();
    }, [file, provider]);

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
        if (file) {
        let file_name = file.name.split(".")[0];
        let file_extension = file.name.split(".")[1];
        let file_array_count = parseInt((fileParts.length * 500) / 10000) + 1;
        let transaction = await createNewFile(file_name, file_extension, file_array_count, provider);
        console.log(transaction);
        if (transaction.status === "success") {
            console.log("File Created AFTER TRANSACTION");
        }
    } else {
        alert("Please select a file first");
    }
    }

    async function createFileArrays() {
        if (file) {
            let file_name = file.name.split(".")[0];
            let file_array_count = parseInt((fileParts.length * 500) / 10000) + 1;
            let file_final_array_length = ((fileParts.length * 500) - 500 + (fileParts[fileParts.length - 1].length)) % 10000;
            let transaction = await createNewFileArrays(file_name, file_array_count, file_final_array_length, provider);
            console.log(transaction);
            if (transaction.status === "success") {
                console.log("File Created AFTER TRANSACTION");
            }
        } else {
            alert("Please select a file first");
        }
    }

    async function uploadFile() {
        let file_name = file.name.split(".")[0];
        uploadNewFileEstimateGas(file_name, fileParts, provider);
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
                        onClick={createFile}
                        variant="contained"
                        color="primary"
                        disabled={fileExists === "File Template Exists on the blockchain" ? true : false}
                    >
                        Create File Template
                    </Button>
                    <Typography variant="h7">
                        {fileExists}
                    </Typography>
                </Container>

                <Container justify="center" spacing={3}>
                    <Button type="submit"
                        onClick={createFileArrays}
                        variant="contained"
                        color="primary"
                    >
                        Create File Arrays 
                    </Button>
                </Container>

                <Container justify="center" spacing={3}>
                    <Button type="submit"
                        onClick={uploadFile}
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