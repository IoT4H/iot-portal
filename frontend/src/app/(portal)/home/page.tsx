'use client'
import { ListItemUseCase, ListUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
export default function Home() {

    const router = useRouter();
    const [useCases, setUseCases] = useState<UseCase[]>([]);


    useEffect(  () => {

        const fetchData = async () => {
            const useCaseRes = fetch("http://localhost:1337/api/use-cases")
                .then(res => res.json())
                .then((data) => {
                    const uAr: UseCase[] = data.data.map((useCase: any): UseCase => ({
                        id: useCase.id,
                        title: useCase.attributes.Titel,
                        slug: useCase.attributes.slug,
                        summary: useCase.attributes.Kurzbeschreibung,
                        description: useCase.attributes.Beschreibung,
                        badges: [...useCase.attributes.Tags || []]
                    }));
                    setUseCases(useCases => [...uAr]);
                });
        };

        fetchData();

    }, [])


    return (
        <div className="flex flex-row content-stretch gap-12">
            <ListUseCase title={"Beispiel Use-Cases"}>
                {
                    useCases.length > 0 && useCases.map(useCase =>
                        <ListItemUseCase key={useCase.id} id={useCase.id} title={useCase.title} description={useCase.summary}
                                         badges={useCase.badges} slug={useCase.slug}/>
                    )
                }
            </ListUseCase>


        </div>
    );
}
