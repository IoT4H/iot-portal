import { de } from "@faker-js/faker";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { CheckBox } from "@iot-portal/frontend/app/common/setup/step";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import * as React from "react";
import { useContext, useEffect, useState } from "react";

const Modal = ({open, onClose, config, step } : {open: boolean, onClose?: Function, config: any, step: any}) => {


    const [name, SetName] = useState<string>("");
    const [label, SetLabel] = useState<string>("");
    const [description, SetDescription] = useState<string>("");
    const [gateway, SetGateway] = useState<boolean>(false);

    const setupDevice = () => {
        LoadingState.startLoading();
        const copyStep = step;
        delete copyStep.meta
        fetchAPI(`/api/thingsboard-plugin/deployment/${config.deployment}/steps/action`, {}, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({
                step: copyStep,
                parameter: {
                    name: name,
                    label: label,
                    description: description,
                    gateway: gateway
                }
            })
        }).then(() => {
        }).finally(() => {
            LoadingState.endLoading();
            onClose && onClose();
        })
    }

    const actionable = () => {
        return (label.length > 0) && (Array.from(["DEVICE_PROFILE"]).includes(step.data.thingsboard_profile.entityType) || name.length > 0) && (description.length > 0);
    }

    return open ? <ModalUI onClose={onClose}>
        <div className={" min-w-[30vw] max-w-[80vw] w-80 pb-4"}>
            <h1 className={"text-3xl mb-8 font-bold"}>Gerät einrichten</h1>
            <div className={"pl-4"}>
                <h2 className={"text-xl mb-2 font-base"}>Gerätedetails</h2>
                <div className={"flex flex-col gap-6 pt-4 pl-8"}>
                    <div>
                        <label htmlFor="label" className="block text-md font-medium leading-6 text-gray-900 dark:text-orange-50">
                            Name *
                        </label>
                        <div className="mt-2">
                            <input
                                id="label"
                                name="label"
                                type="text"
                                required
                                onChange={(event) => SetLabel(event.currentTarget.value)}
                                className="block w-full bg-zinc-300/10 rounded py-1.5 text-gray-900 shadow-md ring-1 border-0 ring-inset ring-zinc-700/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    {
                        ["ASSET_PROFILE"].includes(step.data.thingsboard_profile.entityType) && (
                            <div>
                                <label htmlFor="name" className="block text-md font-medium leading-6 text-gray-900 dark:text-orange-50">
                                    { config.form_alternative_label } *
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        onChange={(event) => SetName(event.currentTarget.value)}
                                        className="block w-full bg-zinc-300/10 rounded py-1.5 text-gray-900 shadow-md ring-1 border-0 ring-inset ring-zinc-700/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        )
                    }
                    <div>
                        <label htmlFor="name" className="block text-md font-medium leading-6 text-gray-900 dark:text-orange-50">
                            Beschreibung *
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="description"
                                name="description"
                                required
                                onChange={(event) => SetDescription(event.currentTarget.value)}
                                className="block w-full h-[5em] resize-none bg-zinc-300/10 rounded py-1.5 text-gray-900 shadow-md ring-1 border-0 ring-inset ring-zinc-700/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6"
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className={"mt-8 flex flex-row justify-center"}>
                    <button className={"rounded hover:bg-orange-600 bg-orange-500 text-white px-8 py-2 drop-shadow disabled:bg-zinc-500 disabled:cursor-not-allowed"} disabled={!actionable()}
                    onClick={() => setupDevice()}>Anlegen</button>
                </div>
            </div>

        </div>

    </ModalUI> : <></>;
}
export default Modal;
