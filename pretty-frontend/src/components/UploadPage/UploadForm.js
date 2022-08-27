import BoxButton from '../Generics/BoxButton'
import Box from '../Generics/Box'
import { useEffect, useState } from 'react'
import FileUpload from '../Generics/FileUpload'

import { checkFileExists } from '../../functions/upload'

export default function UploadForm({ provider }) {
  const [file, setSelectedFile] = useState(null)

  const [loading, setLoading] = useState(false)

  const checkIfFileExists = () => {
    if (file) {
      setLoading(true)
      checkFileExists(file, provider)
        .then(res => {
          console.log('res', res)
          setLoading(false)
        })
        .catch(err => {
          console.log('err', err)
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    console.log('file', file)
    checkIfFileExists()
  }, [file])

  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center md:w-full" />
      <Box className="m-6">
        <div className="flex w-full bg-transparent justify-center">
          <p>Upload File</p>
        </div>

        <FileUpload setSelectedFile={setSelectedFile} />

        <BoxButton loading={loading} className="flex justify-center">
          <p>Create File Template</p>
        </BoxButton>
        <BoxButton loading={loading} className="flex justify-center">
          <p>Create File Arrays</p>
        </BoxButton>
        <BoxButton loading={loading} className="flex justify-center">
          <p>Estimate Gas to Upload</p>
        </BoxButton>
        <BoxButton loading={loading} className="flex justify-center">
          <p>Upload File</p>
        </BoxButton>
        <BoxButton loading={loading} className="flex justify-center" onClick={checkIfFileExists}>
          <p>Refresh</p>
        </BoxButton>
      </Box>
      <div className="flex justify-center items-center md:w-full" />
    </div>
  )
}
