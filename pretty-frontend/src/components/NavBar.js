import { useState } from 'react';
import matictokenicon from '../matic-token-icon.svg';

export default function NavBar () {

  const [selectedPage, setSelectedPage] = useState(0);

    return (
      <div className="md:flex top-0 left-0 w-full bg-transparent justify-center">

        <div className="flex w-full space-x-3 justify-center md:justify-start md:ml-6 font-bold text-white text-xl mt-8">
          <p className="">ChainLoader</p>
          <img src={matictokenicon} alt="matic token logo" className="w-8 h-8" />
        </div>

        <div className="flex justify-center md:justify-start mt-8">

        <div className="grid grid-flow-col items-center gap-x-[10px] gap-y-[10px]
              text-white w-100 bg-jp-gray rounded-2xl h-12
              box-border text-16 justify-start justify-self-center m-0 min-w-0
              overflow-x-hidden overflow-y-hidden p-0.5 font-semibold
              ">

          <button className={`pl-4 pr-4 pt-2 pb-2 rounded-xl ${selectedPage === 0 ? 'bg-gray-700' : ''}`} onClick={() => setSelectedPage(0)}>
            Download
          </button>
          <button className={`pl-4 pr-4 pt-2 pb-2 rounded-xl ${selectedPage === 1 ? 'bg-gray-700' : ''}`} onClick={() => setSelectedPage(1)}>
            Upload
          </button>

        </div>

        </div>

        <div className="flex space-x-1 w-full justify-center md:justify-end md:mr-6 mt-8">
          <div className="bg-jp-gray rounded-2xl box-border text-16 p-0.5 font-semibold h-12">

            <button className="flex space-x-1 justify-center align-middle pl-4 pr-4 pt-2 pb-2 rounded-xl">
              <img src={matictokenicon} alt="matic token logo" className="w-6 h-6" />
              <p className="text-white">Polygon</p>
            </button>

          </div>
          <div className="bg-jp-gray rounded-2xl box-border text-16 p-0.5 font-semibold h-12">

            <button className="pl-4 pr-4 pt-2 pb-2 rounded-xl bg-jp-dark-blue border border-jp-light-blue">
              <p className="text-jp-light-blue whitespace-nowrap">Connect Wallet</p>
            </button>

          </div>

        </div>

      </div>
    )

}