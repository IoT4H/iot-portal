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
    onClose?: Function;
    stepData: any;
    deployment: { id: number };
    device: any;
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
    };

    return (
        <>
            <ModalUI onClose={onClose} name={`Bearbeiten`} canClose={allValid}>
                <div className={" min-w-[30vw] max-w-[80vw] w-80 pb-4 mt-4"}>
                    <AttributeEdit
                        Attributes={Attributes}
                        deviceAsset={device}
                        deployment={deployment}
                        allValid={(b) => {
                            SetAllValid(b.reduce((pV, Cv) => pV && Cv, true));
                        }}
                        externalSaveTrigger={handleRegister}
                    />
                </div>

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
            </ModalUI>
        </>
    );
};

export default Modal;
