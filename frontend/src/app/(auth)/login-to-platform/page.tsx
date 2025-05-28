"use client";
import { fetchAPI, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export type Dashboard = {
    id: string;
};

function Connect() {
    useEffect(() => {
        window.addEventListener("message", function (event) {
            console.log(event);
            if (event.data === "login") {
                console.warn("child calling the parent method");
            }
        });
    }, []);

    const router = useRouter();

    const IFRAME_LOGIN_READY = "iframeReady";
    const PARENT_LOGIN_READY = "parentReady";
    const REQUEST_LOGIN_TOKEN = "requestLoginToken";
    const SENDING_LOGIN_TOKEN = "sendingLoginToken";

    const transmitToken = (iframe: any) => {
        window.addEventListener("message", (message) => {
            console.log(message, iframe.contentWindow);

            if (message.data === IFRAME_LOGIN_READY && iframe.contentWindow) {
                iframe.contentWindow.postMessage(PARENT_LOGIN_READY, message.origin);
            }

            if (message.data === REQUEST_LOGIN_TOKEN && iframe.contentWindow) {
                iframe.contentWindow.postMessage(SENDING_LOGIN_TOKEN, message.origin);

                try {
                    fetchAPI(
                        "/api/thingsboard-plugin/login/token",
                        { myself: true },
                        {
                            headers: {
                                Authorization: `Bearer ${Auth.getToken()}`
                            }
                        }
                    ).then((response) => {
                        iframe.contentWindow.postMessage({ login: response }, message.origin);
                        router.replace(
                            getStrapiURLForFrontend(`/api/thingsboard-plugin/url?url=/`)
                        );
                    });
                } catch (e) {
                    console.error(e);
                }
            }
        });
    };

    return (
        <>
            <div className={"text-2xl"}> Sie werden gleich weitergeleitet.</div>
            <iframe
                src={getStrapiURLForFrontend(
                    `/api/thingsboard-plugin/url?url=/login-portal?redirectUri=/home`
                )}
                onLoadedData={(event) => {
                    transmitToken(event.currentTarget);
                }}
                onLoad={(event) => {
                    transmitToken(event.currentTarget);
                }}
                className={"w-[80vw] hidden"}
                height={"800px"}
            ></iframe>
        </>
    );
}

export default function MyDeploymentPage() {
    return (
        <>
            <Connect />
        </>
    );
}
