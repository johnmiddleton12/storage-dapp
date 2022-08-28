import UploadTutorial from './UploadTutorial'
import UploadForm from './UploadForm'
import TransactionStatuses from './TransactionStatuses'

export default function UploadPage({ provider }) {
  return (
    <div>
      <UploadTutorial />

      <UploadForm provider={provider} />

      <TransactionStatuses />
    </div>
  )
}
