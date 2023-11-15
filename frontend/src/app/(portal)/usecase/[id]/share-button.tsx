"use client"
import { ShareIcon } from "@heroicons/react/24/solid";

export default function ShareButton({className, shareData} : {className: string, shareData: {
        title: string,
        text: string,
        url: string,
    }}): React.ReactElement | null {

    // @ts-ignore
    if(typeof window !== 'undefined'  && navigator && navigator.share && navigator.canShare  && navigator.canShare(shareData)) {
        return <ShareIcon className={"cursor-pointer " + className} onClick={() => navigator.share(shareData)}></ShareIcon>;
    } else {
        return null;
    }
}
