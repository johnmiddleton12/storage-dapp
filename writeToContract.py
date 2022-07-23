from web3 import Web3
from web3.exceptions import ContractLogicError

import sys, os

PRIVATE_KEY = os.environ.get('PRIVATE_KEY')
PERSONAL_ADDRESS = os.environ.get('ADDRESS')
RPC_URL = os.environ.get('RPC_URL')
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
                print(CHAIN_SCAN_URL + w3.toHex(w3.keccak(signed_txn.rawTransaction)))
            else:
                print("fail\t" + w3.toHex(w3.keccak(signed_txn.rawTransaction)))
            break
        except Exception as e:
            print(e)
        attempts += 1
    return w3.toHex(w3.keccak(signed_txn.rawTransaction))

w3 = Web3(Web3.HTTPProvider(RPC_URL))

contractAddress = Web3.toChecksumAddress(CONTRACT_ADDRESS)
contractAbi = CONTRACT_ABI

contract = w3.eth.contract(address=contractAddress, abi=contractAbi)

myAddress = Web3.toChecksumAddress(PERSONAL_ADDRESS)
myKey = PRIVATE_KEY

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

# loop through fileParts 500 elements at a time
nonce = w3.eth.getTransactionCount(myAddress)
transactions = []
totalGas = 0
count = 0

try:
    # figure out a way to fix file name thing
    transaction = contract.functions.newFile("testFile5", len(fileParts), fileExtension).buildTransaction({
        'value': 0,
        'chainId': 3,
        'nonce': nonce
    })

    gas_price = w3.eth.gasPrice
    gas_limit = w3.eth.estimateGas(transaction)
    totalGas = gas_price * gas_limit
    transaction.update({'gas': gas_limit})

    signed_txn = w3.eth.account.signTransaction(transaction, private_key=myKey)
    transactions.append(signed_txn)

    nonce += 1

except ContractLogicError as e:
    print(e)
    exit()

for i in range(0, len(fileParts), 500):
    newFileParts = fileParts[i:i+500]

    print('Processing Chunks: ', i, 'to', i + len(newFileParts))

    try:
        # TODO: fix this for large files - it's not working on emptyFile of length 10000, but is on length of 8000 ??
        transaction = contract.functions.setFileParts("testFile5", newFileParts, i, i+len(newFileParts)).buildTransaction({
            'value': 0,
            'chainId': 3,
            'nonce': nonce,
        })

        gas_price = w3.eth.gasPrice
        gas_limit = w3.eth.estimateGas(transaction)
        totalGas += gas_limit * gas_price
        transaction.update({'gas': gas_limit})

        signed_txn = w3.eth.account.signTransaction(transaction, private_key=myKey)
        transactions.append(signed_txn)

    except ContractLogicError as e:
        print(e)
        exit()

    nonce += 1


# convert total cost to eth using web3
totalCost = w3.fromWei(totalGas, 'ether')
print('Estimated Total Cost in Eth:', totalCost)
print('For File Size:', fileSize, 'bytes')

confirm = input("Confirm {} transactions? (y/n) ".format(len(transactions)))

if confirm == 'y':
    print('Sending Transaction Creating File...')
    load_url(transactions[0])
    for i in range(1, len(transactions)):
        print('Sending Upload Transaction ({} of {}): '.format(i, len(transactions) - 1))
        load_url(transactions[i])
    print('Transactions Complete')
else:
    print('Transaction Cancelled')