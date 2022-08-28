import { useEffect, useState } from 'react'
import Box from '../Generics/Box'
import SingleTransaction from './SingleTransaction'

export default function TransactionStatuses({ transactions }) {

  const [statuses, setStatuses] = useState({})

  // function to handle status of transaction
  const handleStatus = (transaction) => {
    transaction.wait()
      .then(() => {
        setStatuses({ ...statuses, [transaction.hash]: 'success' })
      }
      )
      .catch(() => {
        setStatuses({ ...statuses, [transaction.hash]: 'error' })
      }
      )
  }

  // every transaction is checked for status
  useEffect(() => {
    transactions.forEach(transaction => {
      handleStatus(transaction)
    }
    )
  }
  , [transactions])

  const retryTransaction = (hash) => {
    console.log('retryTransaction', hash)
  }

  return (
    <div className="flex justify-center items-center mr-6 ml-6">
      <div className="flex justify-center items-center md:w-[80%]" />
      <Box className="mb-6 mt-6">
        <p className="text-center font-semibold">Transactions</p>
        <p className="text-center font-thin text-red-600">
          Click the error icon on a failed transaction to retry
        </p>
        <div className="flex flex-col items-center w-full bg-transparent justify-center">

          {transactions.map(transaction => (
            <SingleTransaction
              key={transaction.hash}
              hash={transaction.hash}
              status={statuses[transaction.hash]}
              retryTransaction={retryTransaction}
            />
          ))}

        </div>
      </Box>
      <div className="flex justify-center items-center md:w-[80%]" />
    </div>
  )
}
