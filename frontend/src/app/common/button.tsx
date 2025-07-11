export default function Button(p: any) {
    const { children, ...props } = p;

    return (
        <button
            {...props}
            className={`enabled:cursor-pointer text-center bg-orange-400 disabled:bg-gray-500 enabled:hover:bg-orange-500 text-white rounded px-8 py-4 ${props.className}`}
        >
            {children}
        </button>
    );
}
