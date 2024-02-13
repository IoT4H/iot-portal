"use client"
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import React, { useEffect, useState, useRef, MutableRefObject } from "react";


export type Dashboard = {
    id: string;
}

export function ListItemDashboard({setup, dashboard}: {setup: number, dashboard: Dashboard}) {

    const [name, setNAme] = useState<string>();
    const [deploymentName, setDeploymentName] = useState<string>();
    const [description, setDescription  ] = useState<string>();
    const iFrame = useRef();

    useEffect(() => {
        window.addEventListener("message", function(event) {
            if(event.data === "login") {
                console.warn('child calling the parent method');
            }
        });


        try {
            fetchAPI(`/api/thingsboard-plugin/deployment/${setup}/dashboard/${dashboard.id}`, {} ,{
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((response) => {
                setNAme(response.name)
                setDescription(response.configuration.description)
            })
        } catch (e) {
            console.error(e);
        }

    }, [])

    useEffect(() => {
        if(name && deploymentName) {
            setNAme(name.replace(deploymentName + " | ", ""))
        }
    }, [name])

    useEffect(() => {

        fetchAPI(`/api/thingsboard-plugin/deployment/${setup}`, {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((response) => {
            setDeploymentName(response.name);
        });

    }, [])



/*
    useEffect(() => {
        setInterval(() => {

            if(iFrame && iFrame.current) {
                console.info("send " + JSON.stringify({ login: "test2"}) );
                try {

                iFrame.current?.contentWindow.postMessage(JSON.stringify({ login: "test2"}), "*");
                } catch (e) {
                    console.error(e);
                }
            }
        }, 1000)

        console.warn(iFrame)
    }, [iFrame])

*/

    const transmitToken = (iframe: any) => {
        try {
            fetchAPI("/api/thingsboard-plugin/login/token", {} ,{
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((response) => {
                iframe.contentWindow.postMessage({login: response.data}, "*");
            })
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <li className="flex justify-between gap-x-6 py-5 snap-center">
                <Link href={`http://localhost:8080/dashboards/${dashboard.id}`} className={"w-full"}>
                    <div className="flex flex-row gap-x-4 rounded-xl p-4 cursor-pointer w-full hover:bg-gray-400/10">
                        <div className={"flex-grow w-9/12"}>
                            <div className="flex flex-row items-center pb-2 z-10">
                                <h3 className={"font-bold text-inherit text-2xl"}>{ name }</h3>
                            </div>
                            <p className={"dark:text-gray-300 text-sm text-justify"}>{ description }</p>
                        </div>
                    </div>
                    <iframe src={`http://localhost:8080/dashboards/${dashboard.id}`} onLoad={(event) => { transmitToken(event.currentTarget);}} width={"100%"} height={"800px"}></iframe>
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


    const [dashboards, setDashboards] = useState<Array<Dashboard>>(Array.of());

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
                    Array.isArray(dashboards) && dashboards.map((dashboard) => {
                        return (<ListItemDashboard key={dashboard.id} setup={params.id || 0} dashboard={dashboard} />) || (<></>);
                    })
                }
            </ListDashboards>

        </>
    );
}
