"use client"
import { en } from "@faker-js/faker";
import { FieldSetInput, FieldSetSelect } from "@iot-portal/frontend/app/common/FieldSet";
import FlashProgress from "@iot-portal/frontend/app/common/FlashProcess";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { Prompt, PromptType } from "@iot-portal/frontend/app/common/prompt";
import { RelationMapField, RelationMappings } from "@iot-portal/frontend/app/common/RelationMapping";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import * as React from "react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({onClose, config, step, triggerStateRefresh } : {onClose?: Function, config: any, step: any, triggerStateRefresh?: Function}) => {


    const [name, SetName] = useState<string>("");
    const [label, SetLabel] = useState<string>("");
    const [description, SetDescription] = useState<string>("");
    const [gateway, SetGateway] = useState<boolean>(false);


    const [relations, SetRelations] = useState([]);
    const [error, SetError] = useState<string | undefined>();

    const [component, SetComponent] = useState<any>(undefined);

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
        }).then((response) => {
            console.debug(response)
            if(response && response.id ) {
                SetComponent(response.id);
            }
            if(!step.data.flashProcess) {
                if(!!onClose) onClose();
            } else if (response.error) {
                SetError(response.error.message)
            }
        }, (reason) => {
            SetError(reason.error.message)
        }).finally(() => {
            LoadingState.endLoading();
            triggerStateRefresh && triggerStateRefresh();
        })
    }

    const flashComplete = () => {
        fetchAPI(`/api/thingsboard-plugin/deployment/${config.deployment}/steps/action`, {}, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({
                step: step,
                parameter: {
                    flash: {
                        progress: 100
                    }
                }
            })
        }).then((res) => {
        }).finally(() => {
            LoadingState.endLoading();
            triggerStateRefresh && triggerStateRefresh();
        })
    }

    const actionable = () => {
        return (label.length > 0) && (!config.form_alternative_label_required || name.length > 0) && (description.length > 0);
    }

    useEffect(() => {
        SetRelations(step.data.relations)
    }, [step]);

    useEffect(() => {
        console.log(name, relations)
    }, [name, relations]);

    return <>
    { (!step.data.setup || step.state.setup.progress < 100) ?
        <ModalUI onClose={onClose} name={`${step.data.meta.name} einrichten`}>
            <div className={" min-w-[30vw] max-w-[80vw] w-80 pb-4 mt-4"}>
                <div className={""}>
                    <p className={"w-full text-center mt-4"}>Geben Sie nun die Informationen an.</p>
                    <div className={"flex flex-col gap-6 pt-4"}>
                        <div>
                            <FieldSetInput
                                label={"Name"}
                                type="text"
                                required
                                name="label"
                                onChange={(event: any) => SetLabel(event.currentTarget.value)}
                            ></FieldSetInput>
                        </div>
                        {
                            (config.form_alternative_label_required) && (
                                <div>
                                    <FieldSetInput
                                        label={config.form_alternative_label}
                                        type="text"
                                        required
                                        name="name"
                                        onChange={(event: any) => SetName(event.currentTarget.value)}
                                    ></FieldSetInput>
                                </div>
                            )
                        }
                        <div>
                            <FieldSetInput
                                label={"Beschreibung"}
                                multiline
                                type="text"
                                required
                                name="description"
                                className={"h-12"}
                                onChange={(event: any) => SetDescription(event.currentTarget.value)}
                            ></FieldSetInput>
                        </div>
                        <RelationMappings relations={relations} linkingComponent={component} deploymentId={config.deployment} />
                    </div>
                    <div className={"mt-8 flex flex-row justify-center"}>
                        <button className={"rounded hover:bg-orange-600 bg-orange-500 text-white px-8 py-2 drop-shadow disabled:bg-zinc-500 disabled:cursor-not-allowed"} disabled={!actionable()}
                        onClick={() => setupDevice()}>Anlegen</button>
                    </div>
                </div>

            </div>
    </ModalUI> : <FlashProgress onClose={(b?: boolean) => {
            if(b) flashComplete();
            if(!!onClose) onClose();
        }}></FlashProgress>

    }
        {/*{*/}
        {/*    error && createPortal(*/}
        {/*        <Prompt type={PromptType.Error} text={error || ""} actions={[{text : "Schließen", actionFunction: () => {}}]} onClose={() => SetError(undefined)} />,*/}
        {/*        document.getElementById('promptArea')!*/}
        {/*    )*/}
        {/*}*/}
    </>;
}
export default Modal;
