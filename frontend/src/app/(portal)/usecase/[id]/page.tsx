import { mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import CustomMarkdown from "@iot-portal/frontend/app/common/CustomMarkdown";
import { fetchAPI } from "@iot-portal/frontend/lib/api";

function Info({ description } : { description: string; }) {
    return (<CustomMarkdown className={"markdown mx-8 text-justify"}>{description}</CustomMarkdown>);
}


export const dynamic = 'force-dynamic';
export default async function UseCasePage({params}: { params: { id: number } }) {


    const qsPara =
        {
            fields: [ 'description' ],
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


    return (<Info description={useCase.description}/>);
}
