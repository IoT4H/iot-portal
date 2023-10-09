import { XMarkIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import { useContext, useEffect, useState } from "react";
import { getStrapiURL } from "@iot-portal/frontend/lib/api";

export default function Gallery({ index, pics} : { index: number; pics: any[]}) {

    const gallery = useContext(GalleryContext);
    const [currentIndex, setCurrentIndex] = useState(index);
    useEffect( () => {
        setCurrentIndex(index);
    }, [index])

    return (
        <>
            {
                pics.length >= 1 && (
                    <div className={"fixed w-[100vw] h-[100vh] z-50 flex content-center items-center justify-center bg-gray-50/20 backdrop-blur-[1px]"}>
                        <div className={"transition-all ease-out duration-500"}>
                            <div className={'flex flex-row justify-center items-stretch relative flex-wrap 2xl:flex-nowrap max-w-[80vw] max-h-[90vh] 2xl:max-w-[1228px] 2xl:max-h-[1200px]'}>

                                <div className={`order-2 2xl:order-1 py-8 flex-grow-0 flex-shrink-0 w-1/2 2xl:w-24 flex flex-col items-center justify-center ${currentIndex <= 0 ? 'opacity-0' : 'cursor-pointer'}`}  onClick={
                                    () =>  {
                                        if(currentIndex > 0) {
                                            setCurrentIndex(currentIndex - 1);
                                        }
                                    }
                                }>
                                    <ChevronLeftIcon className={"w-24 h-24"}/>
                                </div>
                                <div className={"order-1 2xl:order-2 flex-shrink transition-all ease-out duration-500 relative flex flex-col gap-2 items-center justify-center"}>
                                    <img src={pics[currentIndex] && (getStrapiURL() + pics[currentIndex].url)} className={" transition-all ease-out duration-500 object-contain max-height-100"}/>
                                    <div className={"h-8 text-center align-middle"}>
                                        {pics[currentIndex] ? pics[currentIndex].caption : ''}
                                    </div>
                                </div>
                                <div className={`order-3 py-8 flex-grow-0 flex-shrink-0 w-1/2 2xl:w-24 flex flex-col items-center justify-center ${currentIndex >= pics.length - 1? 'opacity-0' : 'cursor-pointer '}`} onClick={
                                    () =>  {
                                        if(currentIndex < pics.length - 1) {
                                            setCurrentIndex(currentIndex + 1);
                                        }
                                    }
                                }>
                                    <ChevronRightIcon className={"w-24 h-24"}/>
                                </div>
                            </div>
                        </div>
                        <div className={"w-12 text-white/80 bg-orange-500/50 hover:bg-orange-500/80 hover:text-white absolute top-4 right-8 cursor-pointer"}
                             onClick={ () => gallery(0, [])}>
                            <XMarkIcon />
                        </div>
                    </div>
                )
            }
        </>
    );
}
