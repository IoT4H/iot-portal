"use client"
import { ShareIcon } from "@heroicons/react/24/solid";
import { ReactElement } from "react";

export default function ShareButton({className, shareData} : {className: string, shareData: {
        title: string,
        text: string,
        url: string,
    }}): React.ReactElement | null {

    if(navigator.canShare && navigator.share && navigator.canShare(shareData)) {
        return <ShareIcon className={"cursor-pointer " + className} onClick={() => navigator.share(shareData)}></ShareIcon>;
    } else {
        return null;
    }
}
