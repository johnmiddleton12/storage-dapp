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

def load_url(signed_txn):
    attempts = 0
    oldtx = w3.toHex(w3.keccak(signed_txn.rawTransaction))
    while attempts < 10:
        try:
            tx = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        except:
            tx = oldtx
        try:
            oldtx = tx
            receipt = w3.eth.wait_for_transaction_receipt(tx, 10)
            if receipt["status"] == 1:
                print("success\t" + w3.toHex(w3.keccak(signed_txn.rawTransaction)))
                # print link to tx
                # print(CHAIN_SCAN_URL + w3.toHex(w3.keccak(signed_txn.rawTransaction)))
            else:
                print("fail\t" + w3.toHex(w3.keccak(signed_txn.rawTransaction)))
            break
        except Exception as e:
            print(e)
        attempts += 1
    return w3.toHex(w3.keccak(signed_txn.rawTransaction))

w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

contractAddress = Web3.toChecksumAddress(CONTRACT_ADDRESS)
contractAbi = CONTRACT_ABI

contract = w3.eth.contract(address=contractAddress, abi=contractAbi)

myAddress = Web3.toChecksumAddress(PERSONAL_ADDRESS)
myKey = PRIVATE_KEY

nonce = w3.eth.getTransactionCount(myAddress)
count = 0

filePath = sys.argv[1] if len(sys.argv) > 1 else "inputs/songSmall.mp3"
f = open(filePath, "rb")
fileContent = f.read()
fileName = filePath.split('.')[0].split("/")[-1]
fileExtension = f.name.split(".")[-1]
fileSize = os.path.getsize(filePath)
fileHash = hashlib.sha256(fileContent).hexdigest()
# print(fileName, fileExtension, fileSize)
f.close()

# split file content into 32 byte chunks
fileParts = [fileContent[i:i+32] for i in range(0, len(fileContent), 32)]
print('Total 32 Byte Chunks:', len(fileParts))

fileArrayLength = int(len(fileParts) / 10000) + 1
fileFinalPartLength = len(fileParts) % 10000


transactions = []

state = {
    'total_gas': 0,
    'nonce': 0
}

def uploadFileParts(_fileName, _fileArrayIndex, _fileArrayBegin, _fileArrayEnd, _fileParts):
    print('Uploading File Part:', _fileArrayIndex, 'from', _fileArrayBegin, 'to', _fileArrayEnd)
    for i in range(0, len(_fileParts), 500):
        newFileParts = fileParts[i:i+500]

        # print('Processing: ', i + _fileArrayBegin, 'to', _fileArrayBegin + i+500)
        endIndex = i + 500 if _fileArrayBegin + i + 500 < _fileArrayEnd else _fileArrayEnd - _fileArrayBegin
        print('Processing Chunks: ', i, 'to', endIndex)

        transaction = contract.functions.setFileArray(fileName, _fileArrayIndex, i, endIndex, newFileParts).buildTransaction({
            'value': 0,
            'chainId': CHAIN_ID,
            'nonce': state['nonce'],
            'maxFeePerGas': 2300000000000,
        })

        gas_price = w3.eth.gasPrice
        # gas_price = 0
        gas_limit = w3.eth.estimateGas(transaction)
        # gas_limit = 0

        state['total_gas'] += gas_limit * gas_price

        signed_txn = w3.eth.account.signTransaction(transaction, private_key=myKey)
        transactions.append(signed_txn)

        state['nonce'] += 1

state['nonce'] = w3.eth.getTransactionCount(myAddress)

if fileArrayLength > 1:
    for i in range(0, fileArrayLength - 1):
        uploadFileParts(fileName, i, i*10000, (i+1)*10000, fileParts[i*10000:i*10000+10000])
    uploadFileParts(fileName, fileArrayLength - 1, (fileArrayLength-1)*10000, (fileArrayLength-1)*10000+fileFinalPartLength, fileParts[(fileArrayLength-1)*10000:])
else:
    uploadFileParts(fileName, 0, 0, len(fileParts), fileParts)

# convert total cost to eth using web3
totalCost = w3.fromWei(state['total_gas'], 'ether')
print('Estimated Total Cost in Eth:', totalCost)
print('For File Size:', fileSize, 'bytes')

confirm = input("Confirm {} transactions? (y/n) ".format(len(transactions)))

if confirm == 'y':
    for i in range(0, len(transactions)):
        print('Sending Upload Transaction ({} of {}): '.format(i + 1, len(transactions)))
        # w3.eth.sendRawTransaction(transactions[i].rawTransaction)
        load_url(transactions[i])
    print('Transactions Complete')
else:
    print('Transaction Cancelled')