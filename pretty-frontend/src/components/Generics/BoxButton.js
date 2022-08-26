export default function BoxButton(props) {
    return (
        <button onClick={props.onClick} className={`${props.className} bg-gray-700 w-full border border-gray-700 rounded-2xl p-2 bg-opacity-90 hover:bg-opacity-80`}>

            {props.children}

        </button>
    )
}
