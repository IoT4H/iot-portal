import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";
import ReactMarkdown from "react-markdown";


export const dynamic = 'force-dynamic';
function Instruction({ instructions } : { instructions: any[]}) {

    return (
        <>
            { instructions && instructions.map((instruction, index) => (
                <div key={index} className={"mx-8 border-b py-16 border-gray-500/40"} id={instruction.stepName}>
                    <a href={`#${instruction.stepName}`}><h2 className={"font-bold pb-1 text-xl inline-block mb-4"}><ChevronDoubleRightIcon className={"w-6 inline text-orange-500"}/> Schritt {index + 1}: {instruction.stepName}</h2></a><p><ReactMarkdown className={"markdown text-justify"}>{instruction.step}</ReactMarkdown></p>
                    <div className={"grid grid-cols-[repeat(auto-fill,_minmax(9rem,_1fr))] gap-2 py-4 mt-4"}>
                        { instruction.pictures && instruction.pictures.data && instruction.pictures.data.map((pic: any, index: number, allPics: any[]) => {
                            return (
                                    <GalleryImage
                                        key={pic.attributes.hash} thumbnailSrc={getStrapiURL() + pic.attributes.formats.thumbnail.url} src={getStrapiURL() + pic.attributes.url} className={"flex relative object-cover cursor-pointer flex-col items-center flex-wrap content-center align-center justify-center truncate w-full aspect-square max-w-fit max-h-fit min-w-full min-h-full "} />

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

    const useCase = await fetchAPI('/api/use-cases', qsPara).then((data) => {
        return mapUseCase(data.data[0]);
    });

    return (<Instruction instructions={useCase.instructions}></Instruction>);
}
