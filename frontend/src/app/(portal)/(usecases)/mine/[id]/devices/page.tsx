"use client"
import { CpuChipIcon } from "@heroicons/react/20/solid";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import DeviceSetupModal from "@iot-portal/frontend/app/common/DeviceSetupModal";
import FlashProgress from "@iot-portal/frontend/app/common/FlashProcess";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";

const dynamic = 'force-dynamic';

const DeviceBox = ({device, setup, stepData } : {device: any, setup: any, stepData: any}) => {


    const [flashModalOpen, toggleFlashModalOpen] = useReducer((prevState: boolean): boolean => !prevState, false);


    return (
        <div key={device.id.id}  className={`bg-gray-500/25 pl-4 pr-2 py-2 flex flex-row items-center ${device.active !==undefined && "border-l-4" } ${device.active ? "border-green-500" : "border-red-500"}`}>
            <span>{device.label.replace(setup.name + " | ", "")}</span>
            <div className={"flex-shrink-0 ml-auto flex flex-row gap-2"}>
                {stepData.data.flashProcess && <div title={"Flashen"} onClick={toggleFlashModalOpen}
                                                    className={"p-2 rounded-3xl bg-gray-400/25 hover:bg-blue-600/50 text-white cursor-pointer"}>
                    <CpuChipIcon className={"w-4 aspect-square"}/>
                    { flashModalOpen && <FlashProgress stepData={stepData} onClose={() => {}}/>}
                </div>}
                <div title={"Bearbeiten"}
                     className={"p-2 rounded-3xl bg-gray-400/25 hover:bg-green-600/50 text-white cursor-pointer"}>
                    <PencilIcon className={"w-4 aspect-square"}/>
                </div>
                <div title={"Löschen"}
                     className={"p-2 rounded-3xl bg-gray-400/25 hover:bg-red-600/50 text-white cursor-pointer"}>
                    <TrashIcon className={"w-4 aspect-square"}/>
                </div>
            </div>
        </div>
    );
}


const ProfileBox = ({profile, setup, stepData}: { profile: any, setup: any, stepData?: any }) => {

    const [devices, SetDevices] = useState<any>();

    const [modalOpen, toggleModalOpen] = useReducer((prevState: boolean): boolean => !prevState, false);

    useEffect(() => {

        if (!!setup && !!profile) {
            fetchAPI(`/api/thingsboard-plugin/deployment/${setup.id}/${profile.id.entityType.split("_")[0]}/${profile.id.id}/components`, {},
                {
                    headers: {
                        Authorization: `Bearer ${Auth.getToken()}`
                    }
                }).then((respond) => {
                    SetDevices(respond.data);
                })
        }

    }, [profile, setup]);

    return (
        <div className={`p-4 bg-gray-500/20 rounded`}>
            <div className={"flex flex-row items-center"}>
                <h2 className={"text-xl font-bold flex-shrink"}>
                    {profile.name.replace(setup.name + " | ", "")}
                </h2>
                <div className={"aspect-square flex-shrink-0 ml-auto"}>
                    { !!stepData.data && <>
                            <div className={"p-2 rounded-3xl bg-gray-500/25 hover:bg-orange-500/80 text-white cursor-pointer"} onClick={toggleModalOpen}><PlusIcon className={"w-6 aspect-square"}/></div>
                            {  modalOpen && <DeviceSetupModal onClose={toggleModalOpen} config={{
                                deployment: setup.id,
                                "thingsboard_profile":  stepData.data.thingsboard_profile,
                                "form_alternative_label": stepData.data.form_alternative_label,
                                "form_alternative_label_required" : stepData.data.form_alternative_label_required
                            }} step={stepData} triggerStateRefresh={() => {}}></DeviceSetupModal>
                            }
                        </>
                }
                </div>
            </div>
            <p>{ profile.description }</p>
            <span className={"mt-2 block"}>Aktuell eingerichtet:</span>
            <div className={"flex flex-col mt-2 gap-1.5"}>
                {
                    Array.isArray(devices) && devices.map((device: any) => {
                        return (
                            <DeviceBox key={device.id} device={device} setup={setup} stepData={stepData}/>
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

    const [steps, SetSteps] = useState<Array<any>>();

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
                });

                fetchAPI(`/api/thingsboard-plugin/deployment/${respond.id}/steps`, {},
                    {
                        headers: {
                            Authorization: `Bearer ${Auth.getToken()}`
                        }
                    }).then((respond) => {
                    SetSteps(Array.of(...respond).filter((step) => step.__component === "instructions.setup-instruction"));
                });
        });
    }, []);

    return <>
        {
            Array.isArray(setupDeviceProfiles) &&
                <div className={"grid grid-cols-3 gap-3"}>
                    {
                        setupDeviceProfiles.map((profile: any) => {
                            return (
                                <ProfileBox key={profile.id.id} profile={profile} setup={setup} stepData={{ data: steps?.find((step) => step.thingsboard_profile.id == profile.id.id && step.thingsboard_profile.entityType == profile.id.entityType)}} />
                            );

                        })
                    }
                </div>
        }
    </>;
}
export default Page;
