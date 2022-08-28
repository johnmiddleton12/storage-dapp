import BoxButton from '../Generics/BoxButton'
import Box from '../Generics/Box'
import { useEffect, useState } from 'react'
import FileUpload from '../Generics/FileUpload'

import { checkFileExists } from '../../functions/upload'

export default function UploadForm({ provider }) {
  const [file, setSelectedFile] = useState(null)

  const [loading, setLoading] = useState(false)

  const [status, setStatus] = useState(null)

  const [templateExists, setTemplateExists] = useState(false)
  const [arraysExist, setArraysExist] = useState(false)

  const checkIfFileExists = () => {
    if (file) {
      setLoading(true)
      checkFileExists(file, provider)
        .then(res => {
          console.log('res', res)
          setTemplateExists(res[0])
          setArraysExist(res[1])
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
      if (templateExists && arraysExist) {
        setStatus('File template and arrays exist')
      } else if (templateExists) {
        setStatus('File template exists, arrays need to be created')
      } else {
        setStatus('File template does not exist and needs to be created')
      }
    } else {
      setStatus(null)
    }
  }, [templateExists, arraysExist])

  useEffect(() => {
    console.log('file', file)
    checkIfFileExists(file, provider)
  }, [file])

  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center md:w-full" />
      <Box className="m-6">
        <div className="flex w-full bg-transparent justify-center">
          <p>Upload File</p>
        </div>

        {status && (
          <div className="flex w-full bg-transparent justify-center">
            <p className="text-red-600">Status: {status}</p>
          </div>
        )}

        <FileUpload setSelectedFile={setSelectedFile} />

        <BoxButton
          loading={loading}
          disabled={templateExists || !file}
          className="flex justify-center"
        >
          <p>Create File Template</p>
        </BoxButton>
        <BoxButton
          loading={loading}
          disabled={!templateExists || arraysExist}
          className="flex justify-center"
        >
          <p>Create File Arrays</p>
        </BoxButton>
        <BoxButton
          loading={loading}
          disabled={!templateExists || !arraysExist}
          className="flex justify-center"
        >
          <p>Estimate Gas to Upload</p>
        </BoxButton>
        <BoxButton
          loading={loading}
          disabled={!templateExists || !arraysExist}
          className="flex justify-center"
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
