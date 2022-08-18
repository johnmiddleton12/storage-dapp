export default function DualButton ({ leftSide, rightSide }) {
    return (

        <div className="grid grid-flow-col items-center gap-x-[10px] gap-y-[10px]
              text-white w-100 bg-jp-gray rounded-2xl h-12
              box-border text-16 justify-start justify-self-center m-0 min-w-0
              overflow-x-hidden overflow-y-hidden p-0.5 font-semibold whitespace-nowrap
              ">

            {leftSide}
            {rightSide}

        </div>

    )
}