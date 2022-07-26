import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import matictokenicon from '../matic-token-icon.svg'

import { connectWallet, getCurrentWalletConnected } from '../functions/connect'
import DualButton from './Generics/DualButton'

export default function WalletConnector({ setProvider, showConnectWallet }) {
  const [walletAddress, setWalletAddress] = useState('')
  const [chainId, setChainId] = useState('')

  const Balance = (walletAddress, setBalance) => {
    if (window.ethereum && walletAddress.length > 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
      provider
        .getBalance(walletAddress)
        .then(balance => {
          setBalance(ethers.utils.formatEther(balance).substring(0, 6))
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setBalance('0')
    }
  }

  const [status, setStatus] = useState('')
  const [chainStatus, setChainStatus] = useState(null)
  const [balance, setBalance] = useState(0)

  const requestSwitchToChain = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }]
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon',
                rpcUrls: ['https://polygon-rpc.com/'] /* ... */
              }
            ]
          })
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  const fetchData = async () => {
    const { address, chain } = await getCurrentWalletConnected()
    setWalletAddress(address)
    setChainId(chain)

    if (listeners < 2) {
      addWalletListener()
      addChainListener()
      listeners = 2
    }
  }

  var listeners = 0

  if (window.ethereum) {
    fetchData()
  }

  useEffect(() => {
    Balance(walletAddress, setBalance)
  }, [walletAddress, status])

  useEffect(() => {
    if (window.ethereum) {
      if (walletAddress.length > 0) {
        setStatus(
          `${walletAddress.substring(0, 6)}...${walletAddress.substring(
            walletAddress.length - 4,
            walletAddress.length
          )}`
        )
        if (parseInt(chainId, 16) === 137) {
          setChainStatus(
            <div className="flex space-x-1 leading-8">
              <img
                src={matictokenicon}
                alt="matic token logo"
                className="w-6 h-full"
              />
              <p className="text-white">Polygon</p>
            </div>
          )
        } else {
          setChainStatus(
            <button
              className="hover:text-red-400 text-red-600 whitespace-nowrap"
              onClick={requestSwitchToChain}
            >
              <p>Click to Switch to Polygon</p>
            </button>
          )
        }
      } else {
        setStatus('Click to connect to Metamask 🦊')
      }
    } else {
      setStatus('Install Metamask to upload files.')
      setChainStatus(null)
      const provider = new ethers.providers.getDefaultProvider(137)
      setProvider(provider)
    }
  }, [walletAddress, chainId])

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet()
    setWalletAddress(walletResponse.address)
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accounts => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
        } else {
          setWalletAddress('')
        }
      })
    }
  }

  function addChainListener() {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', ChainID => {
        setChainId(ChainID)
      })
    }
  }

  return (
    <div className="md:flex space-x-1 w-full justify-center md:justify-end md:mr-6 mt-8">
      <div className="flex justify-center text-16 font-semibold h-12">
        <div className="flex leading-8 justify-center space-x-1 align-middle bg-jp-gray pl-4 pr-4 pt-2 pb-2 rounded-2xl">
          {showConnectWallet && chainStatus !== null ? (
            chainStatus
          ) : (
            <>
              <img
                src={matictokenicon}
                alt="matic token logo"
                className="w-6 h-full"
              />
              <p className="text-white h-full">Polygon</p>
            </>
          )}
        </div>
      </div>
      {showConnectWallet &&
        (walletAddress.length > 0 ? (
          <div className="mt-4 md:mt-0 flex justify-center text-16 p-0.5 font-semibold h-12">
            <DualButton
              leftSide={
                <div className="flex pl-4 pr-4 pt-2 pb-2 rounded-xl">
                  {balance.toString().substring(0, 5)}
                  {chainId === '0x89' ? ' MATIC' : ' Ξ'}
                </div>
              }
              rightSide={
                <div className="pl-4 pr-4 pt-2 pb-2 rounded-xl bg-gray-700">
                  {status}
                </div>
              }
            />
          </div>
        ) : (
          <div className="mt-4 md:mt-0 flex justify-center text-16 p-0.5 font-semibold h-12">
            <div className="bg-jp-gray rounded-2xl box-border text-16 p-0.5 font-semibold h-12">
              <button
                onClick={connectWalletPressed}
                className="pl-4 pr-4 pt-2 pb-2 rounded-xl bg-jp-dark-blue border border-jp-dark-blue hover:border-jp-light-blue"
              >
                <p className="text-jp-light-blue whitespace-nowrap">{status}</p>
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}
