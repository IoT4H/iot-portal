"use client"
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";


export type Dashboard = {
    id: string;
}

export function ListItemDashboard({dashboard}: {dashboard: Dashboard}) {

    const name = "Test name";
    const description = "blah blah";

    return (
        <>
            <li className="flex justify-between gap-x-6 py-5 snap-center">
                <Link href={""} className={"w-full"}>
                    <div className="flex flex-row gap-x-4 rounded-xl p-4 cursor-pointer w-full hover:bg-gray-400/10">
                        <div className={"flex-grow w-9/12"}>
                            <div className="flex flex-row items-center pb-2 z-10">
                                <h3 className={"font-bold text-inherit text-2xl"}>{ name }</h3>
                            </div>
                            <p className={"dark:text-gray-300 text-sm text-justify"}>{ description }</p>
                        </div>
                    </div>
                </Link>
            </li>
        </>
    );
}

export function ListDashboards ({
                                     children,
                                 }: {
    children: React.ReactNode
}) {
    return (
        <>
                <ul role="list" className="divide-y dark:divide-gray-100/10">
                    { children }
                </ul>
        </>
    );
}


export default async function MyDeploymentPage({params}: { params: { id: number } }) {


    const [dashboards, setDashboards] = useState<Dashboard[]>([]);

    useEffect(() => {

        fetchAPI(`/api/thingsboard-plugin/deployment/${params.id}/dashboards`, {} ,{
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            }
        }).then((dashboards) => {
            setDashboards(dashboards);
        })
    }, []);

    return (
        <>
            <ListDashboards>
                {
                    dashboards.map((dashboard) => {
                        return (<ListItemDashboard key={dashboard.id} dashboard={dashboard} />);
                    })
                }
            </ListDashboards>

        </>
    );
}
