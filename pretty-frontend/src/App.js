import './App.css';

import { useState } from 'react';

import NavBar from './components/NavBar';
import DownloadPage from './components/DownloadPage/DownloadPage';
import UploadPage from './components/UploadPage/UploadPage';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  const [provider, setProvider] = useState('');

  return (
    <Router>
      <div className="min-h-[100vh] w-full h-full bg-gray-800">
        {/* <div className="w-full h-full bg-gray-800"> */}

        <NavBar setProvider={setProvider}/>

        <Routes>
          <Route path="/" element={<DownloadPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
