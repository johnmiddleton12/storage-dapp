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

w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

contractAddress = Web3.toChecksumAddress(CONTRACT_ADDRESS)
contractAbi = CONTRACT_ABI

contract = w3.eth.contract(address=contractAddress, abi=contractAbi)

fileName = sys.argv[1] if len(sys.argv) > 1 else "songSmall.mp3"

transaction = contract.functions.getFileInfo(fileName).call()
print(fileName, transaction)