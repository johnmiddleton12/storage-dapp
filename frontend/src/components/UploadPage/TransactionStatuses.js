import Box from '../Generics/Box'
import SingleTransaction from './SingleTransaction'

export default function TransactionStatuses () {
    return (
      <div className="flex justify-center items-center mr-6 ml-6">
        <div className="flex justify-center items-center md:w-[80%]" />
        <Box className="mb-6 mt-6">
          <p className="text-center font-semibold">Transactions</p>
          <div className="flex flex-col items-center w-full bg-transparent justify-center">
            <SingleTransaction status="error" />
            <SingleTransaction status="loading" />
            <SingleTransaction status="success" />
          </div>
        </Box>
        <div className="flex justify-center items-center md:w-[80%]" />
      </div>
    )
}