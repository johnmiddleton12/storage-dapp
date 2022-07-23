from web3 import Web3
from web3.exceptions import ContractLogicError
import os

RPC_URL = os.environ.get('RPC_URL')
CONTRACT_ADDRESS = os.environ.get('CONTRACT_ADDRESS')
CONTRACT_ABI = os.environ.get('CONTRACT_ABI')

w3 = Web3(Web3.HTTPProvider(RPC_URL))
contractAddress = Web3.toChecksumAddress(CONTRACT_ADDRESS)
contractAbi = CONTRACT_ABI
contract = w3.eth.contract(address=contractAddress, abi=contractAbi)

fileName = 'testFile5'

lengthOfFile = contract.functions.getFileLength(fileName).call()
fileExt = contract.functions.getFileExtension(fileName).call()

print(lengthOfFile, fileExt)

parts = []

for i in range(0, lengthOfFile, 500):
    firstIndex = i
    lastIndex = i + 500 if i + 500 < lengthOfFile else lengthOfFile

    filePart = contract.functions.getFilePart(fileName, firstIndex, lastIndex).call()

    parts.append(filePart)

with open('outputs/{}.{}'.format(fileName, fileExt), 'wb') as f:
    for i in range(len(parts)):
        for j in range(len(parts[i])):
            f.write(parts[i][j])

print(len(parts))