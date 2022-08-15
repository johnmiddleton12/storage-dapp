import BoxButton from './Generics/BoxButton'
import Box from './Generics/Box'

export default function UploadPage() {
  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center md:w-full" />
        <Box className="md:mt-[130px] m-6">
          <div className="flex w-full bg-transparent justify-center">
            <p>Enter File Name</p>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault()
              console.log('uploading file')
            }}
          >
            <input
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
            />
          </form>

          <BoxButton>
            <p>Create File Template</p>
          </BoxButton>
          <BoxButton>
            <p>Create File Arrays</p>
          </BoxButton>
          <BoxButton>
            <p>Estimate Gas to Upload</p>
          </BoxButton>
          <BoxButton>
            <p>Upload File</p>
          </BoxButton>
          <BoxButton>
            <p>Refresh</p>
          </BoxButton>
        </Box>
        <div className="flex justify-center items-center md:w-full" />
      </div>

      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center md:w-full" />
        <Box className="m-6">
          <p>Transactions</p>
        </Box>
        <div className="flex justify-center items-center md:w-full" />
      </div>
    </div>
  )
}
