'use client'
import { ListItemUseCase, ListUseCase, mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { fetchAPI } from '@iot-portal/frontend/lib/api'
export default function Home() {

    const router = useRouter();
    const [useCases, setUseCases] = useState<UseCase[]>([]);


    useEffect(  () => {

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
                            device : {
                                populate: "*"
                            }
                        }
                    }
                }
            ;

        fetchAPI('/use-cases', qsPara).then((data) => {
            const uAr: UseCase[] = data.data.map((useCase: any): UseCase => (mapUseCase(useCase)));
            setUseCases(useCases => [...uAr]);
        });


    }, [])


    return (
        <div className="flex flex-row content-stretch gap-12">
            <ListUseCase title={"Beispiel Use-Cases"}>
                {
                    useCases.length > 0 && useCases.map((u: UseCase) =>
                        <ListItemUseCase key={u.id}  useCase={u} />
                    )
                }
            </ListUseCase>


        </div>
    );
}
