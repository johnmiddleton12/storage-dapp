import { useState, useEffect } from 'react'

import { CheckmarkIcon, ErrorIcon, LoadingIcon } from '../Generics/Icons'

export default function SingleTransaction({ status, hash, retryTransaction }) {

  const [statusIcon, setStatusIcon] = useState(null)

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
        href={`https://polygonscan.com/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className='hover:text-blue-400 hover:underline'
      >
        {hash}
      </a>
        </div>
      {statusIcon}
    </div>
  )
}
