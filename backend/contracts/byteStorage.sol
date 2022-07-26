// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.12 <0.9.0;

// import "hardhat/console.sol";

contract ByteStorage {

    string[] fileNames;

    mapping(string => bytes32[][]) largeFiles;
    mapping(string => uint32) largeFileArrayLength;
    mapping(string => uint32) largeFileFinalLength;
    mapping(string => string) fileExtensions;

    constructor () {
        // max size to do this with to check gas?? 8000 worked, this didn't ???
        // files["emptyFile"] = new bytes32[](10000);
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function newFileTemplate(string memory _fileName, string memory _fileExtension, uint32 _fileLength) public {
        // check if fileName already exists
        if (fileNames.length > 0) {
            for (uint i = 0; i < fileNames.length; i++) {
                if (compareStrings(fileNames[i], _fileName)) {
                    // console.log("File already exists");
                    return;
                }
            }
        }
        // add fileName to array
        fileNames.push(_fileName);
        // add fileLength to array
        largeFileArrayLength[_fileName] = _fileLength;
        // add fileExtension to array
        fileExtensions[_fileName] = _fileExtension;
        // add empty array to array
        largeFiles[_fileName] = new bytes32[][](_fileLength);
    }

    function newFileArray(string memory _fileName, uint32 _fileArrayIndex, uint32 _fileArrayLength) public {
        if (fileNames.length > 0) {
            for (uint i = 0; i < fileNames.length; i++) {
                if (compareStrings(fileNames[i], _fileName)) {
                    // if the array index is greater than the array length, then the array is full
                    if (_fileArrayIndex >= largeFileArrayLength[_fileName]) {
                        // console.log("Array is full");
                        return;
                    }
                    // if the array index is 1 less than the array length, set the final length to the array length
                    if (_fileArrayIndex + 1 == largeFileArrayLength[_fileName]) {
                        largeFileFinalLength[_fileName] = _fileArrayLength;
                    }
                    largeFiles[_fileName][_fileArrayIndex] = new bytes32[](_fileArrayLength);
                    return;
                }
            }
        }
        // console.log("File not found");
    }

    function getFileInfo(string memory _fileName) public view returns (string memory, string memory, uint32, uint32) {
        if (fileNames.length > 0) {
            for (uint i = 0; i < fileNames.length; i++) {
                if (compareStrings(fileNames[i], _fileName)) {
                    return (fileNames[i], fileExtensions[_fileName], largeFileArrayLength[_fileName], largeFileFinalLength[_fileName]);
                }
            }
        }
        return ("No File Found for that Name", "", 0, 0);
    }

    function getFileArray(string memory _fileName, uint32 _fileArrayIndex, uint32 _fileArrayBegin, uint32 _fileArrayEnd) public view returns (bytes32[] memory) {
        if (fileNames.length > 0) {
            for (uint i = 0; i < fileNames.length; i++) {
                if (compareStrings(fileNames[i], _fileName)) {
                    bytes32[] memory returnArray = new bytes32[](_fileArrayEnd - _fileArrayBegin);
                    for (uint j = _fileArrayBegin; j < _fileArrayEnd; j++) {
                        returnArray[j - _fileArrayBegin] = largeFiles[_fileName][_fileArrayIndex][j];
                    }
                    return returnArray;
                }
            }
        }
        // console.log("File not found");
        return new bytes32[](0);
    }

    function setFileArray(string memory _fileName, uint32 _fileArrayIndex, uint32 _fileArrayBegin, uint32 _fileArrayEnd, bytes32[] memory _fileArray) public {
        if (fileNames.length > 0) {
            for (uint i = 0; i < fileNames.length; i++) {
                if (compareStrings(fileNames[i], _fileName)) {
                    for (uint j = _fileArrayBegin; j < _fileArrayEnd; j++) {
                        largeFiles[_fileName][_fileArrayIndex][j] = _fileArray[j - _fileArrayBegin];
                    }
                    // console.log("File array set from", _fileArrayBegin, "to", _fileArrayEnd);
                    return;
                }
            }
        }
        // console.log("File not found");
    }

}