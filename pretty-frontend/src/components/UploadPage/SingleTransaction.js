import { useState, useEffect } from 'react'

import { CheckmarkIcon, ErrorIcon, LoadingIcon } from '../Generics/Icons'

export default function SingleTransaction({ status }) {
  const [statusIcon, setStatusIcon] = useState(null)

  const retryTransaction = () => {
    console.log('retrying transaction')
  };

  useEffect(() => {
    if (status === 'success') {
      setStatusIcon(<CheckmarkIcon className="w-full text-green-600" />)
    } else if (status === 'error') {
      setStatusIcon(<ErrorIcon className="w-full text-red-600" onClick={retryTransaction} />)
    } else {
      setStatusIcon(<LoadingIcon className="w-6 h-6" />)
    }
  }, [status])

  return (
    <div className="flex justify-center w-full m-2 p-3.5 text-jp-light-blue bg-jp-dark-blue rounded-2xl border border-jp-light-blue">
        <div className="w-full overflow-ellipsis overflow-hidden whitespace-nowrap">
      <a
        href="https://polygonscan.com/tx/0x88a4ebf9c7003a20c83e79c408483fc834634394b4b5dedaf8c296e0b8749525"
        target="_blank"
        rel="noopener noreferrer"
      >
        0x88a4ebf9c7003a20c83e79c408483fc834634394b4b5dedaf8c296e0b8749525
      </a>
        </div>
      {statusIcon}
    </div>
  )
}
