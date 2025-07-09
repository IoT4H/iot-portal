"use client";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

export function ModalUI({
    children,
    onClose,
    name,
    canClose = true
}: {
    children: React.ReactNode;
    onClose?: Function;
    name?: string;
    canClose?: boolean;
}) {
    const router = useRouter();

    return (
        <div
            className={
                "fixed w-[100vw] h-[100vh] z-40 backdrop-blur-[2px] bg-zinc-400/20 flex flex-col justify-center items-center flex-wrap top-0 left-0"
            }
        >
            <div
                className={
                    "relative px-12 pt-16 pb-6 block w-max h-max z-50 bg-orange-50 dark:bg-zinc-700 drop-shadow-2xl rounded-md overflow-hidden"
                }
            >
                <div
                    className={`fixed top-2 right-2 p-2 text-white cursor-pointer ${!canClose ? "hidden" : ""}`}
                    onClick={() => (onClose ? onClose() : router.back())}
                >
                    <XMarkIcon
                        className={"h-8 x-8 hover:drop-shadow-xl text-black dark:text-white"}
                    ></XMarkIcon>
                </div>
                {name && (
                    <div
                        className={
                            "fixed top-4 text-2xl  left-6 py-0 pt-2 pr-2  items-center flex flex-row  text-white border-b-2 border-orange-500 font-bold cursor-pointer"
                        }
                    >
                        {name}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
