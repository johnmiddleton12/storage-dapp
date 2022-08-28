export default function Box(props) {
  return (
    <div
      className={`${props.className} flex justify-center items-center w-full`}
    >
      <div className="space-y-4 w-full text-white  bg-jp-gray rounded-2xl p-3.5 font-semibold">
        {props.children}
      </div>
    </div>
  )
}
