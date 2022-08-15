import DownloadForm from './DownloadForm'
import DownloadProgress from './DownloadProgress'

import { useState } from 'react'

export default function DownloadPage() {
    const [downloadedFileParts, setDownloadedFileParts] = useState([])
    const [status, setStatus] = useState('Idle')
    const [contentElement, setContentElement] = useState(null)

    return (
        <div>
            <DownloadForm
                setDownloadedFileParts={setDownloadedFileParts}
                setContentElement={setContentElement}
                setStatus={setStatus}
            />

            <div
                className={`${
                    contentElement === null ? 'hidden' : 'flex'
                } justify-center items-center m-6 mt-6 md:mt-[60px]`}
            >
                <div className='space-y-5 text-white  bg-jp-gray rounded-2xl p-5 font-semibold'>
                    <div className='flex w-full bg-transparent justify-center'>
                        {contentElement}
                    </div>

                    <div id='linkSpot' className='flex w-full bg-transparent justify-center'></div>
                </div>
            </div>

            <DownloadProgress status={status} downloadedFileParts={downloadedFileParts} />
        </div>
    )
}
