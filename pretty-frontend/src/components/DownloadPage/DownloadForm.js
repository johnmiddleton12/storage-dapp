import { useState } from 'react'
import { downloadFile } from '../../functions/download'
import { LoadingIcon } from '../Generics/Icons'

import {
  Transition,
  Dialog
} from '@headlessui/react'
import ExplanationDialog from './ExplanationDialog'
import BoxButton from '../Generics/BoxButton'

const ethers = require('ethers')

export default function DownloadForm({
  setDownloadedFileParts,
  setContentElement,
  setStatus
}) {
  const [fileName, setFileName] = useState('')

  const [loading, setLoading] = useState(false)

  const provider =
    new ethers.providers.getDefaultProvider(137)

  const downloadFileMain = async () => {
    setLoading(true)
    await downloadFile(
      fileName,
      setDownloadedFileParts,
      setContentElement,
      setStatus,
      provider
    )
    setLoading(false)
  }

  const [showExplanation, setShowExplanation] =
    useState(false)
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="md:flex justify-between items-center mb-6 md:mb-6 m-6 md:mt-[130px]">
      <ExplanationDialog
        showExplanation={showExplanation}
        setShowExplanation={setShowExplanation}
      />

      <div className="flex justify-center md:justify-end w-full"></div>

      <div className="w-full md:w-[full] space-y-5 text-white  bg-jp-gray rounded-2xl p-3.5 font-semibold z-20">
        <div className="flex justify-between w-full bg-transparent">
          <div className="flex pt-2 pb-2 pl-2">
            <p>Enter file name</p>
          </div>
          <button
            className={`pl-4 pr-4 pt-2 pb-2 rounded-xl border bg-jp-dark-blue ${
              showHelp
                ? 'border-jp-light-blue hover:border-jp-light-blue'
                : 'border-jp-dark-blue hover:border-jp-light-blue'
            }`}
            onClick={() => {
              setShowHelp(!showHelp)
            }}
          >
            <p className="whitespace-nowrap text-jp-light-blue">
              ?
            </p>
          </button>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault()
            downloadFileMain()
          }}
          className="w-full bg-transparent justify-center space-y-4"
        >
          <input
            className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-2 hover:bg-opacity-80"
            type="text"
            placeholder="Search"
            onChange={e => {
              setFileName(e.target.value)
            }}
          />

          <BoxButton>
            {loading ? (
              <div className="flex justify-center items-center">
                <LoadingIcon />
              </div>
            ) : (
              <p>Download</p>
            )}
          </BoxButton>
        </form>
        <BoxButton
          onClick={() => {
            setShowExplanation(!showExplanation)
          }}
        >
          <p>How it Works</p>
        </BoxButton>
      </div>
      <div className="flex justify-center md:justify-start w-full">
        <Transition
          show={showHelp}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="translate-x-[-250%] md:translate-x-[-100%]"
          enterTo="translate-x-75%"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-75%"
          leaveTo="translate-x-[-250%] md:translate-x-[-100%]"
        >
          <div
            id="help"
            className="flex flex-col text-white justify-center text-center bg-jp-dark-blue p-4 m-4 md:mt-0 mt-6 mb-0 border rounded-2xl"
          >
            <p className="font-semibold">Help</p>
            <p className="font-thin">
              <b>1</b>. Enter the file name to
              download
            </p>
            <p className="font-thin">
              <b>2</b>. Click on the download
              button
            </p>
            <p className="font-thin">
              <b>Sample Files</b>: songSmall7,
              incubator, Sunset-1
            </p>
            <p className="font-thin">
              <b>Note</b>: Enter the file name{' '}
              <b className="font-semibold">
                exactly!
              </b>
            </p>
          </div>
        </Transition>
      </div>
    </div>
  )
}
