import './App.css';

import NavBar from './components/NavBar';

function App() {


  return (
    <div className="absolute w-full h-full bg-gray-800">
      {/* <div className="w-full h-full bg-gray-800"> */}

      <NavBar />

      <div className="flex justify-center items-center mt-14 md:mt-[130px]">
        <div className="space-y-5 text-white  bg-jp-gray rounded-2xl p-3.5 font-semibold">

          <div className="flex w-full bg-transparent justify-center">
            <p>Enter File Name</p>
          </div>

          <div className="flex w-full bg-transparent justify-center">
            <input
              className="bg-gray-800 border border-gray-700 rounded-2xl p-2"
              type="text" placeholder="Search" />
          </div>

          <div className="flex w-full bg-transparent justify-center">
            <button className="bg-gray-700 w-full border border-gray-700 rounded-2xl p-2">
              <p>Download</p>
            </button>
          </div>

        </div>
      </div>

      <div className="flex justify-center items-center m-6 md:m-[25%] mt-14 md:mt-[80px]">
        <div className="space-y-5 text-white  bg-jp-gray rounded-3xl p-3.5 font-semibold">

          <div className="flex w-full align-middle bg-transparent justify-center">
            <p className='h-full p-2'>Status:</p>
            <p className="bg-gray-700 border border-gray-700 rounded-2xl p-2">Downloading</p>
          </div>

          <div className="md:flex w-full bg-transparent justify-center">
            <p className="break-all p-3.5 text-jp-light-blue bg-jp-dark-blue rounded-2xl border border-jp-light-blue">
              0x1410939413042384295808573405983750987509234875032485703425873248702503492857432098523095873420958347509283475092384572039485243857203985743029587109857234095283475029438572039587230948572309487025034928574320985230958734209583475092834750923845720394852448702503492857432098523095873420958347509283475092384572039485244870250349285743209852309587342095834750928347509238457203948524385720398574302958710985723409528347502943857203958723094857230938572039857430295871098572340952834750294385720395872309485723093857203985743029587109857234095283475029438572039587230948572309
            </p>
          </div>

        </div>
      </div>

      

    </div>
  );
}

export default App;
