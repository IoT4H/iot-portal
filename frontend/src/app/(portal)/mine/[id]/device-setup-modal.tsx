"use client"

import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useEffect, useState } from "react";

export default function DeviceSetupModal({ setup, onClose }: { setup: any, onClose: Function}) {


    const [ devicesTypes , SetDevices ] = useState<any>([]);


    useEffect(() => {
        fetchAPI(`/api/thingsboard-plugin/deployment/${setup.id}/deviceTypes`, {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((respond) => {
            SetDevices(respond);
        });
    }, []);


    return (
        <>
            <ModalUI onClose={onClose}>
                <div className={"max-w-3xl w-[75vw]"}>
                    <h1 className={"w-full mr-8 text-2xl font-bold"}>Gerät einrichten</h1>
                    <div className={"mt-2"}>
                        <h1 className={"w-full mr-8 text-xl"}>Wählen Sie die Geräteart:</h1>
                        <div className={"flex grid-cols-12 gap-4 mt-4 w-full justify-stretch content-strech"}>
                            {
                                devicesTypes.map((d: any) => {
                                    return (
                                        <div key={d} className={"col-span-4  p-8 px-16 rounded-xl border border-gray-400/40 bg-gray-400/20 hover:border-gray-600 hover:bg-gray-600/20 cursor-pointer drop-shadow-md flex flex-col content-center justify-center flex-wrap"}>
                                            <span className={"text-bold w-max"}>{ d.name.replace(setup.name + " | ", "") }</span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </ModalUI>
        </>
    );
}
