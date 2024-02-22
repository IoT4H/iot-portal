"use client"
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

export function ModalUI({
                          children, onClose
                      }: {
    children: React.ReactNode, onClose?: Function
}) {

    const router = useRouter();

    return (
        <div className={"fixed w-[100vw] h-[100vh] z-40 backdrop-blur-[2px] bg-zinc-400/20 flex flex-col justify-center items-center flex-wrap top-0 left-0" }>
            <div className={"relative px-12 py-6 block w-max h-max z-50 bg-orange-50 dark:bg-zinc-700 drop-shadow-2xl rounded-md overflow-hidden" }>
                <div className={"fixed top-2 right-2 p-2 text-white cursor-pointer"} onClick={() => onClose ? onClose() : router.back()}><XMarkIcon className={"h-8 x-8 hover:drop-shadow-xl text-black dark:text-white"}></XMarkIcon></div>
                { children }
            </div>
        </div>
    );
}
