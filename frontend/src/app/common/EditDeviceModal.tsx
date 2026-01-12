"use client";

import { ArrowPathIcon, CheckIcon } from "@heroicons/react/16/solid";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { FieldSetInput } from "@iot-portal/frontend/app/common/FieldSet";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type ServerAttributeProps = {
    children: any[];
    attributeName: string;
    type: string;
    minValue?: number;
    maxValue?: number;
    defaultValue: any;
    label: string;
    enforced: boolean;
    description?: string;
};

export type SaveFunction = () => void;
export type SaveAllFunction = () => void;
export type RegisterFunction<T> = (fn: T) => void;

const Modal = ({
    onClose,
    stepData,
    device,
    deployment,
    triggerStateRefresh
}: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    onClose?: Function;
    stepData: any;
    deployment: { id: number };
    device: any;
    // eslint-disable-next-line @typescript-eslint/ban-types
    triggerStateRefresh?: Function;
}) => {
    const Attributes = stepData.data.serverAttributes;

    const [allValid, SetAllValid] = useState<boolean>();

    const childRunRef = useRef<SaveAllFunction | null>(null);

    const handleRegister = (fn: SaveAllFunction) => {
        childRunRef.current = fn;
    };

    const triggerChild = () => {
        childRunRef.current?.();
        allValid && onClose && onClose(true);
    };

    return (
        <>
            <ModalUI onClose={onClose} name={`Eigenschaften bearbeiten`} canClose={allValid}>
                <div className={" min-w-[30vw] max-w-[80vw] w-80 pb-4 mt-4 flex flex-col gap-y-8"}>
                    <p className={"w-full text-center mt-4 text-pretty"}>
                        Hier können die Hinterlegten Eigenschaften für dieses Gerät angepasst werden.
                    </p>
                    <AttributeEdit
                        Attributes={Attributes}
                        deviceAsset={device}
                        deployment={deployment}
                        allValid={(b) => {
                            SetAllValid(b.reduce((pV, Cv) => pV && Cv, true));
                        }}
                        externalSaveTrigger={handleRegister}
                    />
                    <div className={"mt-8 flex flex-row justify-center"}>
                        <button
                            className={
                                "rounded hover:bg-orange-600 bg-orange-500 text-white px-8 py-2 drop-shadow disabled:bg-zinc-500 disabled:cursor-not-allowed"
                            }
                            disabled={!allValid}
                            onClick={() => {
                                triggerChild && triggerChild();
                            }}
                        >
                            Speichern
                        </button>
                    </div>
                </div>
            </ModalUI>
        </>
    );
};

export const AttributeEdit = ({
    Attributes,
    deviceAsset,
    deployment,
    allValid,
    externalSaveTrigger = undefined
}: {
    Attributes: any;
    deviceAsset: any;
    deployment: any;
    allValid: (b: boolean[]) => any;
    externalSaveTrigger?: RegisterFunction<SaveFunction>;
}) => {
    const [validArray, SetValidArray] = useState<boolean[]>(new Array<boolean>(Attributes.length));

    useEffect(() => {
        allValid(validArray);
    }, [validArray]);

    const subChildFns = useRef<SaveFunction[]>([]);

    const handleSubChildRegister = (fn: SaveFunction) => {
        subChildFns.current.push(fn);
    };

    const run = () => {
        subChildFns.current.forEach((fn) => fn());
    };

    useEffect(() => {
        externalSaveTrigger && externalSaveTrigger(run);
    }, [externalSaveTrigger]);

    return (
        <div className={"grid grid-cols-2 gap-8"}>
            {Attributes &&
                Attributes.map((s: ServerAttributeProps, i: number) => (
                    <ServerAttribute
                        key={i}
                        s={s}
                        deviceAsset={deviceAsset}
                        deployment={deployment}
                        validValued={(b) => {
                            SetValidArray(
                                validArray.map((vA, ia, a) => {
                                    if (ia === i) {
                                        return b;
                                    } else {
                                        return vA;
                                    }
                                })
                            );
                        }}
                        externalSaveTrigger={externalSaveTrigger ? handleSubChildRegister : undefined}
                    />
                ))}
        </div>
    );
};

export const ServerAttribute = ({
    s: serverAttributeProps,
    deviceAsset,
    deployment,
    validValued,
    externalSaveTrigger = undefined
}: {
    s: ServerAttributeProps;
    deviceAsset: any;
    deployment: any;
    validValued: (b: boolean) => any;
    externalSaveTrigger?: RegisterFunction<SaveFunction>;
}) => {
    let props = {};

    if (serverAttributeProps.type === "number") {
        if (serverAttributeProps.minValue) {
            props = Object.assign(props, { min: serverAttributeProps.minValue });
        }

        if (serverAttributeProps.maxValue) {
            props = Object.assign(props, { max: serverAttributeProps.maxValue });
        }
    }

    const [v, SetV] = useState();
    const [prevV, SetPrevV] = useState();
    const [preview, SetPreview] = useState();
    const [loadingPrevV, SetLoadingPrevV] = useState<boolean>(false);

    useEffect(() => {
        validValued((serverAttributeProps.enforced && v == "TEST") || !serverAttributeProps.enforced);
    }, [prevV, v, serverAttributeProps]);

    const getCurrentValue = useCallback(() => {
        SetLoadingPrevV(true);
        fetchAPI(
            `/api/thingsboard-plugin/deployment/${deployment.id}/telemetry/${deviceAsset.id.entityType}/${deviceAsset.id.id}/values/attributes/SERVER_SCOPE`,
            { keys: [serverAttributeProps.attributeName] },
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }
        )
            .then((response: any) => {
                const v =
                    Array.of<{ key: string; value: any }>(...response).find((r: { key: string; value: any }) => {
                        return r.key === serverAttributeProps.attributeName;
                    })?.value || undefined;
                if (v) {
                    SetV(v);
                    SetPrevV(v);
                    SetPreview(v);
                } else {
                    SetV(serverAttributeProps.defaultValue);
                    SetPrevV(serverAttributeProps.defaultValue);
                    SetPreview(serverAttributeProps.defaultValue);
                }
            })
            .finally(() => {
                SetLoadingPrevV(false);
            });
    }, [deployment, deviceAsset]);

    useEffect(() => {
        if (v === prevV) {
            SetLoadingPrevV(false);
        }
    }, [v, prevV]);

    const save = useCallback(() => {
        if (v !== prevV) {
            SetLoadingPrevV(true);
            fetchAPI(
                `/api/thingsboard-plugin/deployment/${deployment.id}/telemetry/${deviceAsset.id.entityType}/${deviceAsset.id.id}/attributes/SERVER_SCOPE`,
                {},
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${Auth.getToken()}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        [serverAttributeProps.attributeName]: serverAttributeProps.type === "number" ? Number(v) : v
                    })
                }
            ).then((response: any) => {
                getCurrentValue();
            });
        }
    }, [deployment, deviceAsset, v, prevV]);

    useEffect(() => {
        getCurrentValue();
    }, []);

    useEffect(() => {
        externalSaveTrigger && externalSaveTrigger(save);
    }, [externalSaveTrigger, save]);

    return (
        <>
            <FieldSetInput
                label={serverAttributeProps.label}
                type={serverAttributeProps.type}
                value={v}
                inputClassName={"pr-10"}
                required={serverAttributeProps.enforced}
                {...props}
                placeholder={preview}
                onChange={(event: { currentTarget: { value: any } }) => {
                    SetV(event.currentTarget.value);
                }}
                actionButtons={
                    <>
                        {prevV !== v && !loadingPrevV && externalSaveTrigger === undefined && (
                            <button
                                className={"p-1 bg-orange-500 rounded" + " absolute" + "  text-white right-2"}
                                onClick={() => save()}
                            >
                                <ArrowRightIcon className={"h-5 w-5"} />
                            </button>
                        )}
                        {prevV === v && !loadingPrevV && externalSaveTrigger === undefined && (
                            <div className={"p-1 absolute  text-green-500 right-2"}>
                                <CheckIcon className={"h-5 w-5"} />
                            </div>
                        )}
                        {loadingPrevV && (
                            <div className={"p-1 absolute text-orange-500 right-2"}>
                                <ArrowPathIcon className={"h-5 w-5"} />
                            </div>
                        )}
                    </>
                }
            >
                <span className={"text-sm text-gray-300 pt-1"}>{serverAttributeProps.description}</span>
                {serverAttributeProps.children}
            </FieldSetInput>
        </>
    );
};

export default Modal;
