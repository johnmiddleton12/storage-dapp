import { useState } from 'react'
import { downloadFile } from '../../functions/download'
import LoadingIcon from '../LoadingIcon'

import { Transition } from '@headlessui/react'

const ethers = require('ethers')

export default function DownloadForm({ setDownloadedFileParts, setContentElement, setStatus }) {
    const [fileName, setFileName] = useState('')

    const [loading, setLoading] = useState(false)

    const provider = new ethers.providers.getDefaultProvider(137)

    const downloadFileMain = async () => {
        setLoading(true)
        await downloadFile(fileName, setDownloadedFileParts, setContentElement, setStatus, provider)
        setLoading(false)
    }

    const [showHelp, setShowHelp] = useState(false)

    return (
        <div className='md:flex justify-between items-center mb-6 md:mb-6 m-6 mt-14 md:mt-[130px]'>

            <div className='flex flex-col justify-center items-center w-[0%] md:w-full'>
            </div>

            <div className='w-full md:w-[full] space-y-5 text-white  bg-jp-gray rounded-2xl p-3.5 font-semibold z-50'>
                <div className='flex justify-between w-full bg-transparent'>
                    <div className='flex pt-2 pb-2 pl-2'>
                        <p>Enter file name</p>
                    </div>
                    <button
                        className='pl-4 pr-4 pt-2 pb-2 rounded-xl border bg-jp-dark-blue border-jp-light-blue text-jp-light-blue'
                        onClick={() => {
                            setShowHelp(!showHelp)
                        }}
                    >
                        <p className='whitespace-nowrap'>?</p>
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        downloadFileMain()
                    }}
                    className='w-full bg-transparent justify-center space-y-4'
                >
                    <input
                        className='w-full bg-gray-800 border border-gray-700 rounded-2xl p-2'
                        type='text'
                        placeholder='Search'
                        onChange={(e) => {
                            setFileName(e.target.value)
                        }}
                    />

                    <button
                        type='submit'
                        className='bg-gray-700 w-full border border-gray-700 rounded-2xl p-2'
                    >
                        {loading ? (
                            <div className='flex justify-center items-center'>
                                <LoadingIcon />
                            </div>
                        ) : (
                            <p>Download</p>
                        )}
                    </button>
                </form>
            </div>
            <div className='flex justify-center md:justify-start w-full md:w-full'>
            <Transition
                show={showHelp}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='translate-x-[-250%] md:translate-x-[-100%]'
                enterTo='translate-x-75%'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-75%'
                leaveTo='translate-x-[-250%] md:translate-x-[-100%]'
            >
                <div id='help' className='flex bg-jp-dark-blue text-white font-semibold p-4 m-4 md:mt-0 mt-6 mb-0 border rounded-2xl'>
                    <p className=''>Help</p>
                </div>
            </Transition>
            </div>
        </div>
    )
}
