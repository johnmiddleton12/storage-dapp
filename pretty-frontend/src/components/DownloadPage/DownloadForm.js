import { useState } from "react";
import { downloadFile } from "../../functions/download";
const ethers = require("ethers");

export default function DownloadForm({setDownloadedFileParts, setContentElement, setStatus}) {

    const [fileName, setFileName] = useState('');

    const provider = new ethers.providers.getDefaultProvider(137);

    const downloadFileMain = () => {
        downloadFile(fileName, setDownloadedFileParts, setContentElement, setStatus, provider);
    }

    return (
        <div className="flex justify-center items-center m-6 mt-14 md:mt-[130px]">
            <div className="space-y-5 text-white  bg-jp-gray rounded-2xl p-3.5 font-semibold">

                <div className="flex w-full bg-transparent justify-center">
                    <p>Enter File Name</p>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    downloadFileMain();
                }}
                    className="w-full bg-transparent justify-center space-y-4"
                >

                    <input
                        className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-2"
                        type="text" placeholder="Search" onChange={(e) => { setFileName(e.target.value) }} />

                    <button type="submit" className="bg-gray-700 w-full border border-gray-700 rounded-2xl p-2">
                        <p>Download</p>
                    </button>

                </form>

            </div>
        </div>
    );
}