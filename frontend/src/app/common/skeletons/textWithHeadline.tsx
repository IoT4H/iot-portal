export default function TextWithHeadline({ ...props }) {
    return (
        <div role="status" {...props} className={`max-w-sm animate-pulse ${props.className}`}>
            <div className="h-[1.5em] bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-[1em] bg-gray-200 rounded-full dark:bg-gray-700  max-w-[360px] w-full mb-2.5"></div>
            <div className="h-[1em] bg-gray-200 rounded-full dark:bg-gray-700  mb-2.5 w-full "></div>
            <div className="h-[1em] bg-gray-200 rounded-full dark:bg-gray-700  max-w-[330px] w-full  mb-2.5"></div>
            <div className="h-[1em] bg-gray-200 rounded-full dark:bg-gray-700  max-w-[300px] w-full  mb-2.5"></div>
            <div className="h-[1em] bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] w-full "></div>
        </div>
    );
}

export function TextSkeleton({ ...props }) {
    return (
        <div role="status" className={`max-w-sm animate-pulse ${props.className}`}>
            <div
                {...props}
                className={`h-[1em] bg-gray-200 rounded-full dark:bg-gray-700 w-max`}
            ></div>
        </div>
    );
}

export function StepSkeleton({ ...props }) {
    return (
        <div
            role="status"
            className={`max-w-sm animate-pulse rounded-2xl overflow-hidden h-16 w-full ${props.className}`}
        >
            <div
                {...props}
                className={`h-[1em] bg-gray-200 rounded-full dark:bg-gray-700 w-max`}
            ></div>
        </div>
    );
}
