import { LoadingIcon } from "./Icons"

export default function BoxButton(props) {
    return (
        <button disabled={props.disabled} onClick={props.onClick} className={`${props.className} ${props.disabled ? 'bg-gray-800' : 'hover:bg-opacity-80 bg-gray-700'} w-full border border-gray-700 rounded-2xl p-2 bg-opacity-90`}>

            {props.loading ? <LoadingIcon className="w-6 h-6" /> : props.children}

        </button>
    )
}
