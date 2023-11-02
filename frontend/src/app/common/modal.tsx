import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

export function ModalUI({
                          children,
                      }: {
    children: React.ReactNode
}) {

    const router = useRouter();

    return (
        <div className={"fixed w-full h-full z-40 backdrop-blur-[2px] bg-zinc-400/20 flex flex-col justify-center items-center flex-wrap" }>
            <div className={"relative px-12 py-6 block w-max h-max z-50 bg-zinc-700 drop-shadow-2xl rounded-md overflow-hidden" }>
                <div className={"fixed top-2 right-2 p-2 text-white cursor-pointer"} onClick={() => router.back()}><XMarkIcon className={"h-8 x-8 hover:drop-shadow-xl"}></XMarkIcon></div>
                { children }
            </div>
        </div>
    );
}
