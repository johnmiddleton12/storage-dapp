import { Link, useLocation } from 'react-router-dom';
import matictokenicon from '../matic-token-icon.svg';
import DualButton from './DualButton';
import WalletConnector from './WalletConnector';

export default function NavBar ({ setProvider }) {

    const location = useLocation(); 

    return (
      <div className="md:flex top-0 left-0 w-full bg-transparent justify-center">

        <div className="flex w-full space-x-3 justify-center md:justify-start md:ml-6 font-bold text-white text-xl pt-8 md:pt-0 md:mt-8">
          <p className="">ChainLoader</p>
          <img src={matictokenicon} alt="matic token logo" className="w-8 h-8" />
        </div>

        <div className="flex justify-center md:justify-start mt-8">

          <DualButton 
            leftSide={
              <Link to="/" className={`pl-4 pr-4 pt-2 pb-2 rounded-xl ${!(location.pathname.includes('upload')) ? 'bg-gray-700 hover:bg-opacity-80' : 'hover:bg-gray-800'}`}>Download</Link>
            }
            rightSide={
              <Link to="/upload" className={`pl-4 pr-4 pt-2 pb-2 rounded-xl ${(location.pathname.includes('upload')) ? 'bg-gray-700 hover:bg-opacity-80' : 'hover:bg-gray-800'}`}>Upload</Link>
            }
          />

        </div>

        <WalletConnector 
          setProvider={setProvider}
          showConnectWallet={(location.pathname.includes('upload'))}
          // showConnectWallet={true}
        />

      </div>
    )

}