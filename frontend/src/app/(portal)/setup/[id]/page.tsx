import { mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { fetchAPI } from "@iot-portal/frontend/lib/api";

export default async function SetupPage({params}: { params: { id: number } }) {


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


    return (
        <>

        </>
    );
}
