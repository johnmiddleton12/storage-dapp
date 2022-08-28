from web3 import Web3
from web3.exceptions import ContractLogicError

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

count = 0

filePath = sys.argv[1] if len(sys.argv) > 1 else "inputs/songSmall.mp3"
f = open(filePath, "rb")
fileContent = f.read()
fileName = filePath.split('.')[0].split("/")[-1]
fileExtension = f.name.split(".")[-1]
fileSize = os.path.getsize(filePath)
print(fileName, fileExtension, fileSize)
f.close()

# split file content into 32 byte chunks
fileParts = [fileContent[i:i+32] for i in range(0, len(fileContent), 32)]
print('Total 32 Byte Chunks:', len(fileParts))
fileArrayLength = int(len(fileParts) / 10000) + 1
fileFinalPartLength = len(fileParts) % 10000

print('Calculating Total Cost')
state = {
    'total_gas': 0,
    'nonce': w3.eth.getTransactionCount(myAddress),
}

def createFileArray(_fileName, _fileArrayIndex, _fileArrayLength):
    transaction = contract.functions.newFileArray(_fileName, _fileArrayIndex, _fileArrayLength).buildTransaction({
        'from': myAddress,
        'nonce': state['nonce'],
        'maxFeePerGas': 2400000000000
    })
    state['total_gas'] += w3.eth.estimateGas(transaction) * w3.eth.gasPrice
    signed_txn = w3.eth.account.signTransaction(transaction, private_key=myKey)
    transactions.append(signed_txn)

# create base array transaction
confirm = input("Create Base Array? (y/n)")
if confirm == 'y':
    transaction = contract.functions.newFileTemplate(fileName, fileExtension, fileArrayLength).buildTransaction({'from': myAddress, 'nonce': state['nonce']})
    state['total_gas'] += w3.eth.estimateGas(transaction) * w3.eth.gasPrice
    signed_txn = w3.eth.account.signTransaction(transaction, private_key=myKey)
    state['nonce'] += 1
    totalCost = w3.fromWei(state['total_gas'], 'ether')
    print('Estimated Total Cost in Eth:', totalCost)
    print('For File Size:', fileSize, 'bytes')
    load_url(signed_txn)
    exit()

transactions = []
for i in range(0, fileArrayLength - 1):
    print('Creating File SubArray:', i)
    createFileArray(fileName, i, 10000)
    state['nonce'] += 1
createFileArray(fileName, fileArrayLength - 1, fileFinalPartLength)

totalCost = w3.fromWei(state['total_gas'], 'ether')
print('Estimated Total Cost in Eth:', totalCost)
print('For File Size:', fileSize, 'bytes')

confirm = input('Confirm {} Transactions? (y/n)'.format(len(transactions)))
if confirm == 'y':
    for i in range(0, len(transactions)):
        print('Sending Transaction:', i + 1)
        load_url(transactions[i])

    print('Transactions Completed')
else:
    print('Transactions Cancelled')
    sys.exit(0)