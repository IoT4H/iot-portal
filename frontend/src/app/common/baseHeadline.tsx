import BaseBody from "@iot-portal/frontend/app/common/baseBody";
import * as React from "react";

export default function BaseHeadline(props: any) {
    return (
        <div className={"bg-orange-100 dark:bg-zinc-800 shadow sticky top-32 z-10"}>
            <BaseBody>
                <h2 className={"dark:text-white font-extrabold text-3xl inline-block py-2 px-4 h-16 empty:hidden "}>{props.children}</h2>
            </BaseBody>
        </div>
    );
}
