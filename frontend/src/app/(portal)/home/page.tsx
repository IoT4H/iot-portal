'use client'
import { ListItemUseCase, ListUseCase, mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
export default function Home() {

    const router = useRouter();
    const [useCases, setUseCases] = useState<UseCase[]>([]);


    useEffect(  () => {

        const qs = require('qs');
        const query = qs.stringify(
            {
                fields: '*',
                populate: {
                    Thumbnail: {
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
            },
            {
                encodeValuesOnly: true, // prettify URL
            }
        );


        const fetchData = async () => {
            const useCaseRes = fetch(`http://localhost:1337/api/use-cases?${query}`)
                .then(res => res.json())
                .then((data) => {
                    const uAr: UseCase[] = data.data.map((useCase: any): UseCase => (mapUseCase(useCase)));
                    setUseCases(useCases => [...uAr]);
                });
        };

        fetchData();

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
