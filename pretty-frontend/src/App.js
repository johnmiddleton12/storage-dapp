import { useState } from 'react';

import './App.css';

import matictokenicon from './matic-token-icon.svg';

function App() {

  const [selectedPage, setSelectedPage] = useState(0);

  return (
    <div className="absolute w-full h-full bg-gray-800">

      <div className="flex absolute top-0 left-0 w-full bg-transparent justify-center">

        <div className="flex absolute left-6 font-bold text-white text-xl">

          <p className="pr-3">Main Page</p>
          <img src={matictokenicon} alt="matic token logo" className="w-8 h-8" />
          
        </div>

        <div className="grid grid-flow-col items-center gap-x-[10px] gap-y-[10px]
              text-white w-100 bg-black rounded-2xl
              box-border text-16 justify-start justify-self-center m-0 min-w-0
              overflow-x-hidden overflow-y-hidden p-0.5 leading-none
              font-semibold
              ">

          <button className={`pl-4 pr-4 pt-2 pb-2 rounded-xl ${selectedPage === 0 ? 'bg-gray-700' : ''}`} onClick={() => setSelectedPage(0)}>
            Upload
          </button>
          <button className={`pl-4 pr-4 pt-2 pb-2 rounded-xl ${selectedPage === 1 ? 'bg-gray-700' : ''}`} onClick={() => setSelectedPage(1)}>
            Download 
          </button>

        </div>

        <div className="absolute right-6 font-bold text-white text-xl">
          Connect Wallet
        </div>

      </div>

    </div>
  );
}

export default App;
