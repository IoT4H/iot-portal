import BaseBody from "@iot-portal/frontend/app/common/baseBody";
import React from "react";

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <BaseBody>
            <div className="flex-auto rounded bg-white dark:bg-zinc-800 p-8 shadow max-h-full sticky top-0">
                {props.children}
            </div>
        </BaseBody>
    );
}
