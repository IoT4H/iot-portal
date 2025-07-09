import * as React from "react";

export default function BaseBody(props: any) {
    return (
        <div className="mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8 w-full">{props.children}</div>
    );
}
