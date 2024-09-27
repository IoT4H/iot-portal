import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import BlocksRenderer from "@iot-portal/frontend/app/common/BlocksRenderer";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { CheckBox } from "@iot-portal/frontend/app/common/setup/step";
import { fetchAPI, getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import * as React from "react";
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
                    {
                        instruction.__component == "instructions.list-instruction" && Array.isArray(instruction.tasks) && (
                            <ul className={"list-disc list-inside marker:text-orange-500 marker:font-bold"}>
                                {
                                    instruction.tasks.map((t: any, index: number) => {
                                        return <li key={t.text} className={"selection:bg-orange-100/10 selection:text-orange-500 "}>{t.text}</li>
                                    })
                                }
                            </ul>
                        )

                    }
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
                    populate: ['meta', 'tasks']
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
