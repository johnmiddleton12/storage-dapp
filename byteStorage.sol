// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.12 <0.9.0;

contract ByteStorage {

    // make into bytes32[][] for larger files
    mapping(string => bytes32[]) files;
    // check for existing fileNames
    string[] fileNames;
    mapping(string => uint32) fileLengths;
    mapping(string => string) fileExtensions;

    constructor () {
        // max size to do this with to check gas?? 8000 worked, this didn't ???
        // files["emptyFile"] = new bytes32[](10000);
    }

    function newFile(string memory fileName, uint32 fileLength, string memory fileExt) public {
        files[fileName] = new bytes32[](fileLength);
        fileLengths[fileName] = fileLength;
        fileExtensions[fileName] = fileExt;
    }
    
    function getFilePart(string memory fileName, uint32 begin, uint32 end) public view returns (bytes32[] memory) {
        bytes32[] memory returnArr = new bytes32[](end - begin);

        for (uint32 i = begin; i < end; i += 1) {
            returnArr[i - begin] = files[fileName][i];
        }

        return returnArr;
    }

    function setFileParts(string memory fileName, bytes32[] calldata fileParts, uint32 startIndex, uint32 endIndex) public {
        for (uint i = startIndex; i < endIndex; i += 1) {
            files[fileName][i] = fileParts[i - startIndex];
        }
    }

    // helpers
    function getFileLength(string memory fileName) public view returns (uint32) {
        return fileLengths[fileName];
    }
    function getFileExtension(string memory fileName) public view returns (string memory) {
        return fileExtensions[fileName];
    }


}