"use client"
"client-only"
import { ShareIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function ShareButton({className, shareData} : {className: string, shareData: {
        title: string,
        text: string,
        url: string,
    }}): React.ReactElement | null {

    const [supported, SetSupported] = useState(false);

    useEffect(() => {
        // @ts-ignore
        SetSupported(typeof window !== 'undefined'  && navigator && navigator.share && navigator.canShare  && navigator.canShare(shareData));
    })

    if(supported) {
        return (<ShareIcon className={"cursor-pointer " + className} onClick={() => navigator.share(shareData)}></ShareIcon>);
    } else {
        return null;
    }
}
