import { useState, useEffect } from "react";
import { Grid, Container, Typography } from "@mui/material";

import LoadingButton from '@mui/lab/LoadingButton';

import Transactions from "./Transactions";

import { getFileInfo, createNewFile, estimateNewFileGas, uploadNewFileEstimateGas, uploadNewFile, createNewFileArrays } from "../functions/upload";

export default function Upload({ provider }) {

    const [file, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [completion, setCompletion] = useState(0);
    const [uploadCompletion, setUploadCompletion] = useState(0);
    const [gasEstimate, setGasEstimate] = useState(0);

    const [fileExists, setFileExists] = useState("");
    const [fileArraysExists, setFileArraysExists] = useState(false);
    const [fileArraysExistsMessage, setFileArraysExistsMessage] = useState("");

    const [transactions, setTransactions] = useState([]);

    async function checkFileExists() {
        if (file) {
            setLoading(true);
            setCompletion(0);
            setUploadCompletion(0);
            setGasEstimate(0);
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
                setFileArraysExistsMessage("Create file template first");
                setFileArraysExists(false);
            } else {
                setFileExists("File Template Exists on the blockchain");
                // TODO: this is not a permanent solution
                if (fileInfo[3] === 0) {
                    let array_count = parseInt((fileParts.length * 500) / 10000) + 1;
                    setFileArraysExistsMessage("arrays have not been created, " + array_count + " arrays need to be created (each costs .3-.7 matic)");
                    setFileArraysExists(false);
                } else {
                    setFileArraysExistsMessage("arrays have been created");
                    setFileArraysExists(true);
                }
            }
            setLoading(false);
        } else {
            setFileExists("");
            setFileArraysExists("");
        }
    }
    useEffect(() => {
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

            setTransactions([...transactions, transaction]);
            console.log(transaction);
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
        } else {
            alert("Please select a file first");
        }
    }

    async function uploadFileEstimateGas() {
        let file_name = file.name.split(".")[0];
        setLoading(true);
        setCompletion(0);
        let totalGas = await uploadNewFileEstimateGas(file_name, fileParts, provider, setCompletion);
        setGasEstimate(totalGas);
        setLoading(false);
    }

    async function uploadFile() {
        let file_name = file.name.split(".")[0];
        setLoading(true);
        setUploadCompletion(0);
        await uploadNewFile(file_name, fileParts, provider, setUploadCompletion);
        setLoading(false);
    }

    async function refresh() {
        await checkFileExists();
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
                    <LoadingButton variant="contained" component="label" loading={loading} >
                        Select File
                        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} hidden />
                    </LoadingButton>
                </Container>
                <br />

                <Container justify="center" spacing={3}>
                    <LoadingButton type="submit"
                        onClick={createFile}
                        variant="contained"
                        color="primary"
                        disabled={fileExists === "File Template Exists on the blockchain" ? true : false}
                        loading={loading}
                    >
                        Create File Template
                    </LoadingButton>
                    <Typography variant="h7">
                        {fileExists}
                    </Typography>
                </Container>

                <Container justify="center" spacing={3}>
                    <LoadingButton type="submit"
                        onClick={createFileArrays}
                        variant="contained"
                        color="primary"
                        loading={loading}
                        disabled={fileArraysExists}
                    >
                        Create File Arrays
                    </LoadingButton>
                    <Typography variant="h7">
                        {fileArraysExistsMessage}
                    </Typography>
                </Container>

                <Container justify="center" spacing={3}>
                    <LoadingButton type="submit"
                        onClick={uploadFileEstimateGas}
                        variant="contained"
                        color="primary"
                        loading={loading}
                        disabled={!fileArraysExists || !fileExists}
                    >
                        Estimate Gas to Upload
                    </LoadingButton>

                    <Typography variant="h7">
                        {completion > 0 && completion !== 100 ? "Estimating Gas..." : ""}
                    </Typography>

                    <Typography variant="h7">
                        {gasEstimate > 0 ? "Estimated Gas: " + gasEstimate.toString().substring(0, 6) + ` Matic (${fileParts.length} transactions)` : ""}
                    </Typography>

                    <Typography variant="h7">
                        {completion > 0 && completion !== 100 ? "Calculated " + completion + "% of file" : ""}
                    </Typography>

                </Container>

                <Container justify="center" spacing={3}>
                    <LoadingButton type="submit"
                        onClick={uploadFile}
                        variant="contained"
                        color="primary"
                        loading={loading}
                        disabled={!fileArraysExists || !fileExists}
                    >
                        Upload File
                    </LoadingButton>

                    <Typography variant="h7">
                        {uploadCompletion > 0 ? "Uploaded " + uploadCompletion + "% of file" : ""}
                    </Typography>

                </Container>

                <Container justify="center" spacing={3}>
                    <LoadingButton type="submit"
                        onClick={refresh}
                        variant="contained"
                        color="primary"
                        loading={loading}
                    >
                        Refresh
                    </LoadingButton>
                </Container>

                <Container justify="center" spacing={3}>
                    <Transactions
                        transactions={transactions}
                        setTransactions={setTransactions}
                        provider={provider}
                    />
                </Container>

            </Container>
        </Grid>

    )
}