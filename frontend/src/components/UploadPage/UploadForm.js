import BoxButton from '../Generics/BoxButton'
import Box from '../Generics/Box'
import { useEffect, useState } from 'react'
import FileUpload from '../Generics/FileUpload'

import { checkFileExists, createNewFileTemplate, createNewFileArrays, uploadNewFileEstimateGas, uploadNewFile } from '../../functions/upload'

export default function UploadForm({ provider, transactions, setTransactions }) {

  const [file, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [templateExists, setTemplateExists] = useState(false)
  const [arraysExist, setArraysExist] = useState(false)
  const [arrayCount, setArrayCount] = useState(0)
  const [gasEstimate, setGasEstimate] = useState(0)
  const [uploadGasEstimate, setUploadGasEstimate] = useState(0)

  const checkIfFileExists = () => {
    if (file) {
      setLoading(true)
      checkFileExists(file, provider)
        .then(res => {
          console.log('res', res)
          setTemplateExists(res[0])
          setArraysExist(res[1])
          setGasEstimate(res[2])
          setArrayCount(res[3])
          setLoading(false)
        })
        .catch(err => {
          console.log('err', err)
          setLoading(false)
        })
    } else {
      setStatus(null)
    }
  }

  useEffect(() => {
    if (file) {
      if (templateExists && arraysExist && uploadGasEstimate > 0) {
        setStatus('File template and arrays exist, gas estimate: ' + uploadGasEstimate.toString().substring(0, 6) + ' MATIC')
      } else if (templateExists && arraysExist) {
        setStatus('File template and arrays exist')
      } else if (templateExists) {
        setStatus(`File template exists, ${arrayCount} arrays need to be created (0.3-0.7 matic each)`)
      } else {
        setStatus(`File template does not exist - estimated gas: ~${gasEstimate} matic`)
      }
    } else {
      setStatus(null)
    }
  }, [file, templateExists, arraysExist, uploadGasEstimate])

  useEffect(() => {
    console.log('file', file)
    checkIfFileExists(file, provider)
  }, [file, transactions])

  const handleCreateFileTemplate = async () => {
    setLoading(true)
    await checkFileExists(file, provider)
    createNewFileTemplate(provider)
      .then(res => {
        setTransactions([...transactions, res])
        console.log('res', res)
      })
      .catch(err => {
        console.log('err', err)
      }
      )
      setLoading(false)
  }

  const handleCreateFileArrays = async () => {
    setLoading(true)
    await checkFileExists(file, provider)
    createNewFileArrays(provider)
      .then(res => {
        setTransactions(transactions.concat(res))
        console.log('res', res)
      }
      )
      .catch(err => {
        console.log('err', err)
      }
      )
    setLoading(false)
  }

  const handleUploadNewFileEstimateGas = async () => {
    setLoading(true)
    await checkFileExists(file, provider)
    uploadNewFileEstimateGas(provider)
      .then(res => {
        setUploadGasEstimate(res)
        console.log('res', res)
      })
      .catch(err => {
        console.log('err', err)
      })
    setLoading(false)
  }

  const handleUploadNewFile = async () => {
    setLoading(true)
    await checkFileExists(file, provider)
    uploadNewFile(provider)
      .then(res => {
        setTransactions(transactions.concat(res))
        console.log('res', res)
      })
      .catch(err => {
        console.log('err', err)
      })
    setLoading(false)
  }

  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center md:w-full" />
      <Box className="m-6">
        <div className="flex w-full bg-transparent justify-center">
          <p>Upload File</p>
        </div>

        {provider._isProvider ? (
        status && (
          <div className="flex w-full bg-transparent justify-center whitespace-nowrap">
            <p className="text-red-600">Status: {status}</p>
          </div>
        )
        ) : (
          <div className="flex w-full bg-transparent justify-center whitespace-nowrap">
            <p className="text-red-600">Connect Wallet to Upload</p>
          </div>
        )}

        <FileUpload setSelectedFile={setSelectedFile} />

        <BoxButton
          loading={loading}
          disabled={templateExists || !file}
          className="flex justify-center"
          onClick={handleCreateFileTemplate}
        >
          <p>Create File Template</p>
        </BoxButton>
        <BoxButton
          loading={loading}
          disabled={!templateExists || arraysExist}
          className="flex justify-center"
          onClick={handleCreateFileArrays}
        >
          <p>Create File Arrays</p>
        </BoxButton>
        <BoxButton
          loading={loading}
          disabled={!templateExists || !arraysExist}
          className="flex justify-center"
          onClick={handleUploadNewFileEstimateGas}
        >
          <p>Estimate Gas to Upload</p>
        </BoxButton>
        <BoxButton
          loading={loading}
          disabled={!templateExists || !arraysExist}
          className="flex justify-center"
          onClick={handleUploadNewFile}
        >
          <p>Upload File</p>
        </BoxButton>
        <BoxButton
          loading={loading}
          className="flex justify-center"
          onClick={checkIfFileExists}
        >
          <p>Refresh</p>
        </BoxButton>
      </Box>
      <div className="flex justify-center items-center md:w-full" />
    </div>
  )
}
