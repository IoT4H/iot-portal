import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";
import ReactMarkdown from "react-markdown";


function Instruction({ instructions } : { instructions: any[]}) {

    return (
        <>
            { instructions && instructions.map((instruction, index) => (
                <div key={index} className={"mx-8 border-b py-16 border-gray-500/40"} id={instruction.stepName}>
                    <a href={`#${instruction.stepName}`}><h2 className={"font-bold pb-1 text-xl inline-block mb-4"}><ChevronDoubleRightIcon className={"w-6 inline text-orange-500"}/> Schritt {index + 1}: {instruction.stepName}</h2></a><p><ReactMarkdown className={"markdown text-justify"}>{instruction.step}</ReactMarkdown></p>
                    <div className={"grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] gap-2 py-4"}>
                        { instruction.pictures && instruction.pictures.data && instruction.pictures.data.map((pic: any, index: number, allPics: any[]) => {
                            return (
                                <div
                                    key={pic.attributes.hash}
                                    className={"flex cursor-pointer relative flex-col items-center flex-wrap content-center align-center justify-center truncate w-full aspect-square"}
                                >
                                    <GalleryImage  init={index} imageList={allPics.map(p => p.attributes)} src={getStrapiURL() + pic.attributes.formats.thumbnail.url} className={"absolute max-w-fit max-h-fit min-w-full min-h-full "} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )) }
        </>
    );
}


export default async function Instructions({params}: { params: { id: number } }) {

    const qsPara =
        {
            populate: {
                instructions: {
                    populate: '*',
                },
            },
            filters: {
                slug: {
                    $eq: params.id,
                },
            },
        }
    ;

    const useCase = await fetchAPI('/use-cases', qsPara).then((data) => {
        return mapUseCase(data.data[0]);
    });

    return (<Instruction instructions={useCase.instructions}></Instruction>);
}
