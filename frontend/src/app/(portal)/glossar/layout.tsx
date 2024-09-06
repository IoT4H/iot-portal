import TextWithHeadline from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import React, { Suspense } from "react";

export default function Layout(props: { children: React.ReactNode}) {
    return (
        <div className="flex-auto rounded bg-white dark:bg-zinc-800 p-4 shadow max-h-full sticky top-0">
            { props.children }
        </div>
    )
}
