import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import BlocksRenderer from "@iot-portal/frontend/app/common/BlocksRenderer";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { fetchAPI, getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import ReactMarkdown from "react-markdown";


export const dynamic = 'force-dynamic';
function Instruction({ instructions } : { instructions: any[]}) {

    return (
        <>
            { instructions && instructions.map((instruction, index) => (
                <div key={instruction.meta.name} className={"mx-8 border-b py-16 border-gray-500/40"}
                     id={instruction.meta.name}>
                    <a href={`#${instruction.meta.name}`}><h2 className={"font-bold pb-1 text-xl inline-block mb-4"}>
                        <ChevronDoubleRightIcon className={"w-6 inline text-orange-500"}/> Schritt {index + 1}: {instruction.meta.name}</h2>
                    </a>
                    <div>
                        <BlocksRenderer content={instruction.meta.text} className={"markdown text-justify"}></BlocksRenderer>
                    </div>
                </div>
            ))}
        </>
    );
}


export default async function Instructions({params}: { params: { id: number } }) {

    const qsPara =
        {
            populate: {
                setupSteps: {
                    populate: 'meta',
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

    return (<Instruction instructions={useCase.setupSteps}></Instruction>);
}
