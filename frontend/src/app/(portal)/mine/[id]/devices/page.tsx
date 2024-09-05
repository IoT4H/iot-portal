"use client"
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const dynamic = 'force-dynamic';


const ProfileBox = ({ profile, setup } : { profile: any, setup: any }) => {

    const [devices, SetDevices] = useState<any>();

    useEffect(() => {
        fetchAPI(`/api/thingsboard-plugin/deployment/${setup.id}/${profile.id.entityType.split("_")[0]}/${profile.id.id}/components`, {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((respond) => {
                SetDevices(respond.data);
            })
    }, [profile, setup]);

    return (
        <div className={`p-4 bg-gray-500/20 rounded`}>
            <div className={"flex flex-row items-center"}>
                <h2 className={"text-xl font-bold flex-shrink"}>
                    {profile.name.replace(setup.name + " | ", "")}
                </h2>
                <div className={"aspect-square flex-shrink-0 ml-auto"}>
                    <div className={"p-2 rounded-3xl bg-gray-500/25 text-white cursor-pointer"}><PlusIcon className={"w-6 aspect-square"}/></div>
                </div>
            </div>
            <p> {profile.description} </p>
            <span className={"mt-2 block"}>Aktuell eingerichtet:</span>
            <div className={"flex flex-col mt-2"}>
                {
                    Array.isArray(devices) && devices.map((device: any) => {
                        return (
                            <div key={device.id.id} className={"bg-gray-500/25 pl-4 pr-2 py-2 flex flex-row items-center"}>
                                <span>{ device.label.replace(setup.name + " | ", "") }</span>
                                <div className={"flex-shrink-0 ml-auto flex flex-row gap-2"}>
                                    <div className={"p-2 rounded-3xl bg-gray-500/25 text-white cursor-pointer"}>
                                        <PencilIcon
                                        className={"w-4 aspect-square"}/>
                                    </div>
                                    <div className={"p-2 rounded-3xl bg-gray-500/25 text-white cursor-pointer"}>
                                        <TrashIcon className={"w-4 aspect-square"}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

const Page = ({params}: { params: { id: number } }) => {


    const [setup, SetSetup] = useState<any>();
    const [setupDeviceProfiles, SetSetupDeviceProfiles] = useState<Array<any>>();


    useEffect(() => {
        LoadingState.startLoading();
        fetchAPI(`/api/thingsboard-plugin/deployment/${params.id}`, {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((respond) => {
            SetSetup(respond);
                fetchAPI(`/api/thingsboard-plugin/deployment/${params.id}/profiles`, {},
                    {
                        headers: {
                            Authorization: `Bearer ${Auth.getToken()}`
                        }
                    }).then((response) => {
                    if(response.complete) {
                        SetSetupDeviceProfiles(response);
                    } else {
                        SetSetupDeviceProfiles(response);
                    }
                    LoadingState.endLoading();
                })
        });
    }, []);

    return <>
        {
            Array.isArray(setupDeviceProfiles) &&
                <div className={"grid grid-cols-3 gap-3"}>
                    {
                        setupDeviceProfiles.map((profile: any) => {
                            return (
                                <ProfileBox key={profile.id.id} profile={profile} setup={setup} />
                            );

                        })
                    }
                </div>
        }
    </>;
}
export default Page;
