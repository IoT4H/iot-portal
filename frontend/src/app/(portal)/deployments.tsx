import Status from "@iot-portal/frontend/app/(portal)/deployment-status";
import Loading from "@iot-portal/frontend/app/common/loading";
import Link from "next/link";
import { Suspense } from "react";


export type Deployment = {
    id: number;
    name: string;
    status: string;
    description: string;
}

export function ListItemDeployment({deployment}: {deployment: Deployment}) {

    // @ts-ignore
    return (
        <>
            <li className="flex justify-between gap-x-6 py-5 snap-center">
                <Link href={"/mine/" + deployment.id} className={"w-full"}>
                    <div className="flex flex-row gap-x-4 rounded-xl p-4 cursor-pointer w-full hover:bg-gray-400/10">
                        <div className={"flex-grow w-9/12"}>
                            <div className="flex flex-row items-center pb-2 z-10">
                                <h3 className={"font-bold text-inherit text-2xl"}>{ deployment.name }</h3>
                            </div>
                            <p className={"dark:text-gray-300 text-sm text-justify"}>{ deployment.description }</p>
                        </div>
                        <div className={"w-2/12 flex items-start justify-end"}>
                        <Suspense>
                            <Status id={deployment.id}></Status>
                        </Suspense>
                        </div>
                    </div>
                </Link>
            </li>
        </>
    );
}

export function ListDeployments ({  title,
                                 children,
                             }: {
    title: string;
    children: React.ReactNode
}) {
    return (
        <>
            <div className="flex-auto rounded bg-white dark:bg-zinc-800 p-4 shadow max-h-full sticky top-0">
                <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 ml-[1em] mt-[1em] py-1 border-orange-500 "}>{ title }</h2>
                <ul role="list" className="divide-y dark:divide-gray-100/10">
                    { children }
                </ul>
            </div>
        </>
    );
}
