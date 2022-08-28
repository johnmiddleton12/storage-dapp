import BoxButton from "./BoxButton"

export default function FileUpload (props) {

    const handleFileChange = (e) => {
        props.setSelectedFile(e.target.files[0])
    }

    return (
        <BoxButton>
          <form
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            {/* <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700">Default file input example</label> */}
            <input
              className={`${props.className} form-control block
                    w-full
                    rounded-2xl
                    px-3
                    py-1.5
                    font-normal
                    text-white
                    focus:text-gray-700 focus:bg-gray-500 focus:border-blue-600 focus:outline-none`}
              type="file"
              id="formFile"
              onChange={handleFileChange}
            ></input>
          </form>
        </BoxButton>

    )
}