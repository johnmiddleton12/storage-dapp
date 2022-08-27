import BoxButton from '../Generics/BoxButton'
import Box from '../Generics/Box'
import { CheckmarkIcon, ErrorIcon, LoadingIcon } from '../Generics/Icons'

export default function UploadForm () {
    return (
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center md:w-full" />
        <Box className="m-6">
          <div className="flex w-full bg-transparent justify-center">
            <p>Upload File</p>
          </div>

          <BoxButton>
            <form
              onSubmit={e => {
                e.preventDefault()
              }}
            >
              {/* <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700">Default file input example</label> */}
              <input
                className="form-control
                    block
                    w-full
                    rounded-2xl
                    px-3
                    py-1.5
                    font-normal
                    text-white
                    focus:text-gray-700 focus:bg-gray-500 focus:border-blue-600 focus:outline-none"
                type="file"
                id="formFile"
              ></input>
            </form>
          </BoxButton>

          <BoxButton className="flex justify-between">
            <div className="w-6">
            </div>
            <p className="">Create File Template</p>
            <ErrorIcon className="right-0"/>
          </BoxButton>
          <BoxButton className="flex justify-between">
            <div className="w-6">
            </div>
            <p>Create File Arrays</p>
            <CheckmarkIcon className=""/>
          </BoxButton>
          <BoxButton className="flex justify-between">
            <div className="w-6">
            </div>
            <p>Estimate Gas to Upload</p>
            <LoadingIcon className="w-6 h-6"/>
          </BoxButton>
          <BoxButton className="flex justify-between">
            <div className="w-6">
            </div>
            <p>Upload File</p>
            <CheckmarkIcon className=""/>
          </BoxButton>
          <BoxButton className="flex justify-center">
            <p>Refresh</p>
          </BoxButton>
        </Box>
        <div className="flex justify-center items-center md:w-full" />
      </div>
    )
}