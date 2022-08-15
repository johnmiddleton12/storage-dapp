export default function DownloadProgress({ status, downloadedFileParts }) {
    return (
        <div className='flex justify-center items-center m-6 md:m-[25%] md:mb-0 mt-0 md:mt-[60px] pb-20'>
            <div className='space-y-5 text-white  bg-jp-gray rounded-3xl p-3.5 font-semibold'>
                <div className='flex w-full align-middle bg-transparent justify-center text-center'>
                    <p className='h-full p-2'>Status:</p>
                    <p className='bg-gray-700 border border-gray-700 rounded-2xl p-2'>{status}</p>
                </div>

                <div className='md:flex w-full bg-transparent justify-center'>
                    <p className='break-all p-3.5 text-jp-light-blue bg-jp-dark-blue rounded-2xl border border-jp-light-blue'>
                        {downloadedFileParts.length > 0 ? (
                            <>
                                {downloadedFileParts
                                    .at(downloadedFileParts.length - 1)
                                    .slice(0, 10)}
                                <br />
                                ...
                                <br />
                                {downloadedFileParts
                                    .at(downloadedFileParts.length - 1)
                                    .slice(
                                        downloadedFileParts.at(downloadedFileParts.length - 1)
                                            .length - 10,
                                        downloadedFileParts.at(downloadedFileParts.length - 1)
                                            .length,
                                    )}
                            </>
                        ) : (
                            'No file downloaded'
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}