from web3 import Web3
from web3.exceptions import ContractLogicError

# how tf does this fix
from web3.middleware import geth_poa_middleware

import os, sys
import hashlib

PRIVATE_KEY = os.environ.get('PRIVATE_KEY')
PERSONAL_ADDRESS = os.environ.get('ADDRESS')
RPC_URL = os.environ.get('RPC_URL')
CHAIN_ID = int(os.environ.get('CHAIN_ID'))
CHAIN_SCAN_URL = os.environ.get('CHAIN_SCAN_URL')
CONTRACT_ADDRESS = os.environ.get('CONTRACT_ADDRESS')
CONTRACT_ABI = os.environ.get('CONTRACT_ABI')

w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

contractAddress = Web3.toChecksumAddress(CONTRACT_ADDRESS)
contractAbi = CONTRACT_ABI

contract = w3.eth.contract(address=contractAddress, abi=contractAbi)

myAddress = Web3.toChecksumAddress(PERSONAL_ADDRESS)
myKey = PRIVATE_KEY

nonce = w3.eth.getTransactionCount(myAddress)
count = 0

fileName = sys.argv[1] if len(sys.argv) > 1 else "songLarge"

transaction = contract.functions.getFileInfo(fileName).call()

fileName = transaction[0]
fileExtension = transaction[1]
fileArrayLength = transaction[2]
fileFinalPartLength = transaction[3]

if not os.path.isdir('outputs'):
    os.makedirs('outputs')

downloadedFileParts = []

def downloadFileParts(_fileName, _fileArrayIndex, _fileArrayBegin, _fileArrayEnd):
    print('Downloading File Part:', _fileArrayIndex, 'from', _fileArrayBegin, 'to', _fileArrayEnd)
    for i in range(0, _fileArrayEnd - _fileArrayBegin, 500):

        print('Processing: ', i + _fileArrayBegin, 'to', _fileArrayBegin + i+500)

        endIndex = i + 500 if _fileArrayBegin + i + 500 < _fileArrayEnd else _fileArrayEnd - _fileArrayBegin

        print('Indexing: ', i, 'to', endIndex)

        transaction = contract.functions.getFileArray(fileName, _fileArrayIndex, i, endIndex).call()

        downloadedFileParts.append(b''.join(transaction))

if fileArrayLength > 1:
    for i in range(0, fileArrayLength - 1):
        downloadFileParts(fileName, i, i * 10000, (i + 1) * 10000)
    downloadFileParts(fileName, fileArrayLength - 1, (fileArrayLength - 1) * 10000, (fileArrayLength - 1) * 10000 + fileFinalPartLength)
else:
    downloadFileParts(fileName, 0, 0, fileFinalPartLength - 1)

with open('outputs/{}.{}'.format(fileName, fileExtension), 'wb') as f:
    for part in downloadedFileParts:
        f.write(part)