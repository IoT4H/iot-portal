"use client";

import { AttributeEdit } from "@iot-portal/frontend/app/common/EditDeviceModal";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import * as React from "react";
import { useRef, useState } from "react";

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
            <ModalUI onClose={onClose} name={`Eigenschaften`} canClose={allValid}>
                <div className={" min-w-[30vw] max-w-[80vw] w-80 pb-4 mt-4 flex flex-col gap-y-16"}>
                    <p className={"w-full text-center mt-4 text-pretty"}>
                        Es müssen ein paar Eigenschaften für dieses Gerät hinterlegt werden damit dieser Use-Case
                        richtig funktioniert.
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
                    <div className={"flex flex-row justify-center"}>
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

export default Modal;
