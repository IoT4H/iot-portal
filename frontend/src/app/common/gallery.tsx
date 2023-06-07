import { XMarkIcon } from "@heroicons/react/20/solid";
import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import { useContext } from "react";

export default function Gallery({ index, pics} : { index: number; pics: any[]}) {

    const gallery = useContext(GalleryContext);

    return (
        <>
            {
                pics.length >= 1 && (
                    <div className={"absolute w-full h-full z-50 flex content-center items-center justify-center bg-gray-50/20 "}>
                        <div className={"bg-zinc-700 p-12 drop-shadow-2xl pt-16"}>
                            <div className={"w-12 absolute top-2 right-2 cursor-pointer"}
                                 onClick={ () => gallery(0, [])}>
                                <XMarkIcon />
                            </div>
                            <img src={"http://localhost:1337" + pics[index].url}  className={"max-w-[50vw] max-h-[50vh]"}/>
                        </div>
                        <div className={"absolute w-full h-full"}
                             onClick={() => gallery(0, [])}
                        >
                        </div>
                    </div>
                )
            }
        </>
    );
}
