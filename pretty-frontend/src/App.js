import './App.css';

import NavBar from './components/NavBar';
import DownloadPage from './components/DownloadPage/DownloadPage';
import UploadPage from './components/UploadPage';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {


  return (
    <Router>
      <div className="min-h-screen w-full h-full bg-gray-800">
        {/* <div className="w-full h-full bg-gray-800"> */}

        <NavBar />

        <Routes>
          <Route path="/" element={<DownloadPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
