export default function Button ({ ...props }) {
    return <button className={`cursor-pointer text-center bg-orange-500/80 hover:bg-orange-500 text-white rounded mx-4 px-8 py-4 ${props.className}`}>
        { props.children }
    </button>
}
