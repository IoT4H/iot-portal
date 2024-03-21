import { ListItemUseCase, ListUseCase, mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { fetchAPI } from '@iot-portal/frontend/lib/api'

export const dynamic = 'force-dynamic';
export default async function Home() {


    const qsPara =
        {
            fields: '*',
            populate: {
                thumbnail: {
                    populate: '*',
                },
                tags: {
                    populate: '*',
                },
                Images: {
                    populate: '*',
                    device: {
                        populate: "*"
                    }
                },
                firms: {
                    populate: '*',
                    Logo: {
                        populate: "*"
                    }
                },
            }
        }
    ;

    const useCases = await (async () => {
        const useCasesData = await fetchAPI('/api/use-cases', qsPara, {
                headers: {
                    "Content-Type": "application/json",
                    cache: "no-cache"
                }
            });
        return useCasesData ? useCasesData.data.map(
            (useCase: any): UseCase => (mapUseCase(useCase))) : [];
    })();


    return (
        <div className="flex flex-row content-stretch gap-12">
            <ListUseCase title={"Use-Cases"}>
                {
                    useCases.length > 0 && useCases.map((u: UseCase) =>
                        <ListItemUseCase key={u.id} useCase={u}/>
                    )
                }
            </ListUseCase>


        </div>
    );
}
