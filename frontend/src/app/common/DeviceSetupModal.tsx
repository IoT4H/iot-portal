"use client"

import { FieldSetInput, FieldSetPatternInput } from "@iot-portal/frontend/app/common/FieldSet";
import FlashProgress from "@iot-portal/frontend/app/common/FlashProcess";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { Prompt, PromptType } from "@iot-portal/frontend/app/common/prompt";
import { RelationMappings } from "@iot-portal/frontend/app/common/RelationMapping";
import Spinner from "@iot-portal/frontend/app/common/spinner";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";

enum overlaps { undefined, OVERLAP , LOADING , NO_OVERLAP};

const Modal = ({onClose, config, step, triggerStateRefresh } : {onClose?: Function, config: any, step: any, triggerStateRefresh?: Function}) => {


    const [name, SetName] = useState<string>("");
    const [label, SetLabel] = useState<string>("");
    const [description, SetDescription] = useState<string>("");
    const [gateway, SetGateway] = useState<boolean>(false);

    const [flashProcess, switchFlashProcess] = useState<boolean>(false);

    console.log(config)


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
            console.log(response)
            if(response && response.id ) {
                SetComponent(response.id);
            }


            if (response.error) {
                console.log("TEST_2")
                SetError(response.error.message)
            }

            if(step.data.flashProcess === true) {
                switchFlashProcess(true);
            }

            if(!response.error && step.data.flashProcess !== true) {
                console.log("TEST_")
                if(!!onClose) onClose();
            }

        }, (reason) => {
            console.log("TEST_3")
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

    const [overlapStatus, SetOverlapStatus] = useState<overlaps>(overlaps.undefined)

    const actionable = () => {
        return (label.length > 0) && (!config.form_alternative_label_required || (name.length > 0 && overlapStatus === overlaps.NO_OVERLAP) );
    }

    useEffect(() => {
        SetRelations(step.data.relations)
    }, [step]);

    useEffect(() => {
        console.log(name, relations)
    }, [name, relations]);

    useEffect(() => {
        if(!(!step.data.setup || step.state.setup.progress < 100)) {
            switchFlashProcess(true);
        }
    }, [step]);

    useEffect(() => {
        if(name) {
            SetOverlapStatus(overlaps.LOADING);
            fetchAPI(`/api/thingsboard-plugin/deployment/${config.deployment}/ASSET/exist`, { search: name }, {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                },
            }).then((response) => {
                if(response.id?.id) {
                    SetOverlapStatus(overlaps.OVERLAP);
                }
                console.log(response)
                if(response.error?.status == 404) {
                    SetOverlapStatus(overlaps.NO_OVERLAP);
                }
            })
        }

    }, [name]);

    return <>
    { (!flashProcess) ?
        <ModalUI onClose={onClose} name={`${step.data.meta.name}`}>
            <div className={" min-w-[30vw] max-w-[80vw] w-80 pb-4 mt-4"}>
                <div className={""}>
                    <p className={"w-full text-center mt-4 text-pretty"}>Folgende Informationen werden benötigt,<br/> um die richtigen Konfigurationen in der Datenplattform zu hinterlegen.</p>
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
                            (config.form_alternative_label_required) && ( !!!step.data.form_alternative_label_pattern ? (
                                <div>
                                    <FieldSetInput
                                        label={config.form_alternative_label}
                                        type="text"
                                        required
                                        name="name"
                                        onChange={(event: any) => SetName(event.currentTarget.value)}
                                    >
                                        {
                                            overlapStatus === overlaps.OVERLAP && <span className={"text-red-600"}>{config.form_alternative_label} bereits in Verwendung!</span> ||
                                            overlapStatus === overlaps.NO_OVERLAP && <span className={"text-green-600"}>{config.form_alternative_label} noch nicht verwendet!</span> ||
                                            overlapStatus === overlaps.LOADING && <><span>Prüft...</span></>
                                        }
                                    </FieldSetInput>
                                </div>
                            ) : (
                                <div>
                                    <FieldSetPatternInput
                                        label={step.data.form_alternative_label}
                                        required
                                        name="name"
                                        pattern={step.data.form_alternative_label_pattern}
                                        onChange={(value: string) => { SetName(value)}}
                                    >
                                        {
                                            overlapStatus === overlaps.OVERLAP && <span className={"text-red-600"}>{config.form_alternative_label} bereits in Verwendung!</span> ||
                                            overlapStatus === overlaps.NO_OVERLAP && <span className={"text-green-600"}>{config.form_alternative_label} noch nicht verwendet!</span> ||
                                            overlapStatus === overlaps.LOADING && <><span>Prüft...</span></>
                                        }
                                    </FieldSetPatternInput>
                                </div>
                            ))
                        }
                        <div>
                            <FieldSetInput
                                label={"Beschreibung (Optional)"}
                                multiline
                                type="text"
                                placeholder={"Dieses Feld kann optional eine Erklärung zum Gerät enthalten."}
                                value={""}
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
        }} stepData={step}></FlashProgress>


        //TODO: move FlashProgress out into Step
    }
        {
            error && <Prompt type={PromptType.Error} text={error || ""} actions={[{text : "Schließen", actionFunction: () => {}}]} onClose={() => SetError(undefined)} />
        }
    </>;
}
export default Modal;
