"use client";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { fetchAPI, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import React, { useCallback, useEffect, useRef, useState } from "react";

export type Dashboard = {
    id: string;
};

export function ListItemDashboard({ setup, dashboard }: { setup: number; dashboard: Dashboard }) {
    const [name, setNAme] = useState<string>();
    const [deploymentName, setDeploymentName] = useState<string>();
    const [description, setDescription] = useState<string>();
    const iFrame = useRef();

    useEffect(() => {
        window.addEventListener("message", function (event) {
            if (event.data === "login") {
                console.warn("child calling the parent method");
            }
        });

        try {
            fetchAPI(
                `/api/thingsboard-plugin/deployment/${setup}/dashboard/${dashboard.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Auth.getToken()}`
                    }
                }
            ).then((response) => {
                setNAme(response.name);
                setDescription(response.configuration?.description || "");
            });
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        if (name && deploymentName) {
            setNAme(name.replace(deploymentName + " | ", ""));
        }
    }, [name]);

    useEffect(() => {
        fetchAPI(
            `/api/thingsboard-plugin/deployment/${setup}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }
        ).then((response) => {
            setDeploymentName(response.name);
        });
    }, []);

    const IFRAME_LOGIN_READY = "iframeReady";
    const PARENT_LOGIN_READY = "parentReady";
    const REQUEST_LOGIN_TOKEN = "requestLoginToken";
    const SENDING_LOGIN_TOKEN = "sendingLoginToken";

    const transmitToken = (iframe: any) => {
        window.addEventListener("message", (message) => {
            if (message.data === IFRAME_LOGIN_READY && iframe.contentWindow) {
                iframe.contentWindow.postMessage(PARENT_LOGIN_READY, message.origin);
            }

            if (message.data === REQUEST_LOGIN_TOKEN && iframe.contentWindow) {
                iframe.contentWindow.postMessage(SENDING_LOGIN_TOKEN, message.origin);

                try {
                    fetchAPI(
                        "/api/thingsboard-plugin/login/token",
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${Auth.getToken()}`
                            }
                        }
                    ).then((response) => {
                        iframe.contentWindow.postMessage({ login: response }, message.origin);
                    });
                } catch (e) {
                    console.error(e);
                }
            }
        });
    };

    return (
        <>
            <li className="flex justify-between gap-x-6 py-5 snap-center">
                <div className={"w-full"}>
                    <div className="flex flex-row gap-x-4 rounded-t-xl p-4 cursor-pointer w-full bg-gray-400/10">
                        <div className={"flex-grow w-9/12"}>
                            <div className="flex flex-row items-center pb-2 z-10">
                                <h3 className={"font-bold text-inherit text-2xl"}>{name}</h3>
                            </div>
                            <p className={"dark:text-gray-300 text-sm text-justify"}>
                                {description}
                            </p>
                        </div>
                    </div>

                    <iframe
                        src={getStrapiURLForFrontend(
                            `/api/thingsboard-plugin/url?url=/login-portal?redirectUri=/dashboards/${dashboard.id}`
                        )}
                        onLoad={(event) => {
                            transmitToken(event.currentTarget);
                        }}
                        width={"100%"}
                        height={"800px"}
                    ></iframe>
                </div>
            </li>
        </>
    );
}

export function ListDashboards({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ul role="list" className="divide-y dark:divide-gray-100/10">
                {children}
            </ul>
        </>
    );
}

export default function MyDeploymentPage({ params }: { params: { id: number } }) {
    const [dashboards, setDashboards] = useState<Array<Dashboard>>(Array.of());
    const [deployed, SetDeployed] = useState<boolean>(false);

    const pullDeploy = useCallback(
        () =>
            fetchAPI(
                `/api/thingsboard-plugin/deployment/${params.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Auth.getToken()}`
                    }
                }
            ).then((response) => {
                SetDeployed(response.status == "deployed");
                if (response.status != "deployed") {
                    setTimeout(pullDeploy, 1000);
                }
            }),
        [params.id]
    );

    useEffect(() => {
        pullDeploy();
    }, [params.id]);

    useEffect(() => {
        if (deployed) {
            LoadingState.startLoading();
            fetchAPI(
                `/api/thingsboard-plugin/deployment/${params.id}/dashboards`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Auth.getToken()}`
                    }
                }
            ).then((dashboards) => {
                setDashboards(dashboards);
                LoadingState.endLoading();
            });
        }
    }, [deployed]);

    return (
        <>
            <ListDashboards>
                {Array.isArray(dashboards) && dashboards.length > 0 ? (
                    dashboards.map((dashboard) => {
                        return (
                            (
                                <ListItemDashboard
                                    key={dashboard.id}
                                    setup={params.id || 0}
                                    dashboard={dashboard}
                                />
                            ) || <></>
                        );
                    })
                ) : (
                    <p className={"text-xl font-extrabold"}>
                        Aktuelle gibt es keine Dashboards anzusehen.
                    </p>
                )}
            </ListDashboards>
        </>
    );
}
