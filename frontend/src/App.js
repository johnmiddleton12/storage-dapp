import './App.css';
import { useState } from 'react';
import { Grid } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import CryptoBox from './components/CryptoBox';
import Download from './components/Download';
import Upload from './components/Upload';
import Footer from './components/Footer';

function App() {

  const [walletAddress, setWallet] = useState("");
  const [chainId, setChainId] = useState(0);

  const [provider, setProvider] = useState(null);

  return (
    <Router>
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Header />

        <CryptoBox
          walletAddress={walletAddress}
          setWallet={setWallet}
          chainId={chainId}
          setChainId={setChainId}
          setProvider={setProvider}
        />

        {walletAddress.length > 0 && provider !== null && parseInt(chainId, 16) === 137 && (
          <>
            <Routes>
              <Route path="/" element={ <Download provider={provider} /> } />
              <Route path="/upload" element={ <Upload provider={provider} /> } />
            </Routes>


          </>)}

          <Footer />

      </Grid>
    </Router>
  );
}

export default App;