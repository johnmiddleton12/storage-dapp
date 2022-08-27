import Box from '../Generics/Box'

import { Disclosure } from '@headlessui/react'
import { DownArrow } from '../Generics/Icons'

export default function UploadTutorial() {
  return (
    <div className="flex justify-center items-center">
        <Disclosure>
          {({ open }) => (
      <Box className={`md:mt-[130px] m-6 ${open ? 'md:w-[60%]' : 'md:w-auto'}`}>
        <div className="flex font-thin flex-col text-center items-center justify-center">
          <Disclosure.Button className="flex">
          <p className="w-full font-semibold">Tutorial</p>
          <DownArrow
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-6 w-6 text-white`}
                />
          </Disclosure.Button>

          <Disclosure.Panel>
          <p className="w-full m-2">
            Information stored on the blockchain is immutable. This means that
            once a transaction is sent, it and the data it contains cannot be
            changed.
          </p>
          <p className="w-full m-2">
            This application is a proof of concept for uploading entire files to
            the blockchain.
          </p>
          <p className="w-full m-2">
            The first barrier when considering this problem is the{' '}
            <b>Block Gas Limit</b>. This is the maximum amount of gas that can
            be used in a single block. It fluctuates with network demands, and
            as of writing stands at around 30,000,000 gas, with a target of
            15,000,000 gas.{' '}
            <a
              href="https://blog.bitmex.com/ethereums-new-1mb-blocksize-limit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-800 font-bold"
            >
              source
            </a>
          </p>

          <p className="w-full m-2">
            This means that you could theoretically create a transaction that
            consumes all of the gas in a single block. In practice, this would
            be nearly impossible, due to network activity and gas price
            fluctuation. This limit essentially caps the amount of bytes that
            can be included in a single transaction.
          </p>

          <p className="w-full m-2">
            To work around this, we split the file into smaller chunks, and
            upload each chunk in a separate transaction.
          </p>

          <p className="w-full m-2">
            Due to the block gas limit, and thus transaction gas limit, we
            can&apos;t create a single array that stores all of the chunks.
            Instead, the files are stored in 2-dimensional arrays. The first
            dimension stores several large arrays, each one allocated to the
            maximum size possible in a single transaction.
          </p>

          <p className="w-full m-2">
            Each one of those arrays is then filled with the data of the file,
            split into several transactions.
          </p>

          <p className="w-full m-2 text-gray-300">
            In summary, the upload process is as follows:
          </p>

          <p className="w-full m-2">
            1. Create the file template - an array of a small size, each element
            to be set to an array of a large size.
            {/* <br />- This step also uploads metadata, including file name, file size, and file hash. */}
          </p>

          <p className="w-full m-2">
            2. Create the individual arrays. Due to the size of each array, we
            must separate the creation of each into its own transaction.
          </p>

          <p className="w-full m-2">
            3. Upload the file chunks. This consists of many transactions, each
            one uploading a chunk of the file to a specific array in the list of
            arrays. This step consists of the most transactions, and with a 3MB
            file, it could take up to 70-80 transactions to upload the file.
          </p>

          <p className="w-full m-2">
            Note: The gas to upload the chunks can actually be estimated, and
            that is what the button is for. However, it is not possible to
            estimate that cost before the arrays are created. This is because
            the chunk storage locations must be allocated before they are tested
            for transaction cost.
          </p>

          <p className="w-full m-2 text-gray-300">
            The specifics of this implementation are described in the code.
            Contact me @{' '}
            <a
              href="mailto:jpm6qjz@virginia.edu"
              className="text-red-800 font-bold"
            >
              jpm6qjz@virginia.edu
            </a>{' '}
            if you have any questions.
          </p>
          </Disclosure.Panel>
        </div>
      </Box>
          )}
        </Disclosure>
    </div>
  )
}
