// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.12 <0.9.0;

contract ByteStorage {

    // make into bytes32[][] for larger files
    mapping(string => bytes32[]) files;
    // check for existing fileNames
    // map fileName to length, getter for that
    string[] public fileNames;

    constructor () {
        // files["emptyFile"] = new bytes32[](10000);
    }

    function newFile(uint32 fileLength, string memory fileName) public {
        files[fileName] = new bytes32[](fileLength);
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

}