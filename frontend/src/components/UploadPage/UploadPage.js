import { useState } from 'react'
import UploadTutorial from './UploadTutorial'
import UploadForm from './UploadForm'
import TransactionStatuses from './TransactionStatuses'

export default function UploadPage({ provider }) {

  const [transactions, setTransactions] = useState([])

  return (
    <div>
      <UploadTutorial />

      <UploadForm provider={provider} transactions={transactions} setTransactions={setTransactions}/>

      <TransactionStatuses transactions={transactions}/>
    </div>
  )
}
