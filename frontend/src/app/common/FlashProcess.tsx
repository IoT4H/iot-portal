"use client";
import { CheckBadgeIcon, CheckIcon, WifiIcon } from "@heroicons/react/24/solid";
import BlocksRenderer from "@iot-portal/frontend/app/common/BlocksRenderer";
import {
    FieldSetCheckbox,
    FieldSetInput,
    FieldSetSelect
} from "@iot-portal/frontend/app/common/FieldSet";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import Spinner from "@iot-portal/frontend/app/common/spinner";
import { fetchAPI, getLittleFSURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import { APITool } from "@iot-portal/frontend/lib/APITool";
import { Auth } from "@iot-portal/frontend/lib/auth";
import CryptoJS from "crypto-js";

import { ESPLoader, FlashOptions, LoaderOptions, Transport } from "esptool-js";
import qs from "qs";
import * as React from "react";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

//TODO: clean up and seperate stepData information between step related data and device related data
const FlashProgress = ({ onClose, stepData }: { onClose?: Function; stepData: any }) => {
    enum Steps {
        VORBEREITUNG = "Vorbereitung",
        ANSCHLIESSEN = "Anschließen",
        VERBINDEN = "Verbinden",
        CONFIGURE = "Konfigurieren",
        FLASHEN = "Flashen",
        UEBERPRUEFEN = "Überprüfung",
        FERTIG = "Abgeschlossen"
    }

    enum FlashState {
        COMPLETE = "Complete"
    }

    enum ConnectionState {
        CONNECTING = "Connecting...",
        CONNECTED = "Connected"
    }

    const StepsData = [
        { name: Steps.VORBEREITUNG, note: "u. U. Treiber installieren" },
        { name: Steps.ANSCHLIESSEN, note: "Verbindung mit PC herstellen" },
        { name: Steps.VERBINDEN, note: "Verbindung herstellen mit ESP" },
        { name: Steps.CONFIGURE, note: "Konfigurieren" },
        { name: Steps.FLASHEN, note: "Firmware auf ESP laden" },
        { name: Steps.UEBERPRUEFEN, note: "Firmware ist aufgespielt" },
        { name: Steps.FERTIG, note: "Vorgang vollständig" }
    ];

    const [step, SetStep] = useState<Steps>(Steps.VORBEREITUNG);

    const [open, SetOpen] = useState<boolean>(true);

    const [device, SetDevice] = useState<any>(null);
    const [state, SetState] = useState<ConnectionState | FlashState | undefined>();
    const [vendorID, SetVendorID] = useState<string | undefined>();
    const [productID, SetProductID] = useState<string | undefined>();
    const [chip, SetChip] = useState<string | undefined>();
    const [wifi, SetWifi] = useState<boolean>(false);
    const [bt, SetBt] = useState<boolean>(false);
    const [wifiMac, SetWifiMac] = useState<string | undefined>();
    const [hz, SetHz] = useState<string | undefined>();
    const [flashProgress, SetFlashProgress] = useState<number>();
    const [fileFlashIndex, SetFileFlashIndex] = useState<number>();
    const [fileFlashCount, SetFileFlashCount] = useState<number>();
    const [flashingInProgress, SetFlashingInProgress] = useState<boolean>(false);
    const [errors, SetErrors] = useState<Array<string>>(new Array<string>());

    const [esploader, SetEsploader] = useState<ESPLoader>();
    const [transport, SetTransport] = useState<Transport>();

    const [devices, SetDevices] = useState<any[]>();

    const [deviceConfig, SetDeviceConfig] = useState({});

    useEffect(() => {
        const platformUrl = new URL(APITool.PlatformURL);

        SetDeviceConfig(
            Object.assign(deviceConfig, {
                platformServer: {
                    url: platformUrl.protocol + "//" + platformUrl.hostname,
                    path: platformUrl.pathname,
                    port: platformUrl.port
                }
            })
        );
    }, []);

    const scanForSerialDevices = () => {
        // @ts-ignore
        navigator.serial.getPorts().then((devices) => {
            console.log(`Total devices: ${devices.length}`);
            SetDevices(devices);
            devices.forEach((device: any) => {
                console.log(
                    `Product name: ${device.productName}, serial number ${device.serialNumber}`
                );
            });
        });
    };

    const deviceConnect = (event: any) => {
        scanForSerialDevices();
        if (step === Steps.ANSCHLIESSEN) {
            SetStep(Steps.VERBINDEN);
        }
    };

    const StepIndex = (findStep: Steps) => {
        return StepsData.findIndex((f) => findStep === f.name);
    };

    const deviceDisconnect = (event: any) => {
        scanForSerialDevices();
        if (
            StepsData.findIndex((f) => step === f.name) <= StepIndex(Steps.VERBINDEN) &&
            Array.isArray(devices) &&
            devices.length === 0
        ) {
            SetStep(Steps.ANSCHLIESSEN);
        } else if (
            StepsData.findIndex((f) => step === f.name) <= StepIndex(Steps.VERBINDEN) &&
            Array.isArray(devices) &&
            devices.length > 0 &&
            event.target == device
        ) {
            SetStep(Steps.VERBINDEN);
            SetDevice(undefined);
        } else if (StepsData.findIndex((f) => step === f.name) < StepIndex(Steps.FERTIG)) {
            SetStep(Steps.VERBINDEN);
            SetDevice(undefined);
        }
    };

    const select = () => {
        new Promise<void>(async (resolve, reject) => {
            if (device === null) {
                // @ts-ignore
                SetDevice(await navigator.serial.requestPort({}));
            } else if (state === ConnectionState.CONNECTING) {
                SetTransport(undefined);
                SetEsploader(undefined);
                SetState(undefined);
                device.close();
                // @ts-ignore
                SetDevice(await navigator.serial.requestPort({}));
            }
            resolve();
        }).then(() => {});
    };

    const espLoaderTerminal = {
        clean() {
            // @ts-ignore
            console.groupEnd("esp");
            console.group("esp");
        },
        writeLine(data: any) {
            // @ts-ignore
            console.log(data);

            if (data.match(new RegExp(/VendorID|ProductID/i))) {
                SetVendorID(data.match(new RegExp(/(?<=VendorID )(\d|\w)+/i))[0]);
                SetProductID(data.match(new RegExp(/(?<=ProductID )(\d|\w)+/i))[0]);
            }

            if (data.match(new RegExp(/Chip is /i))) {
                SetChip(data.match(new RegExp(/(?<=Chip is ).*/i))[0]);
            }

            if (data.match(new RegExp(/Features:.*Wi-?Fi/gim))) {
                SetWifi(true);
            }

            if (data.match(new RegExp(/Features:.*bt/gim))) {
                SetBt(true);
            }

            if (data.match(new RegExp(/^MAC:/))) {
                SetWifiMac(data.match(new RegExp(/(?:[0-9a-f]{2}:?){6}/))[0]);
            }

            if (data.match(new RegExp(/(k|m|g)hz/im))) {
                SetHz(data.match(new RegExp(/\d+(k|m|g)hz/im))[0]);
            }

            if (data.match(new RegExp(/Uploading stub\.\.\./i))) {
                SetState(ConnectionState.CONNECTED);
            }

            if (data.match(new RegExp(/(Wrote)/gim)) && (fileFlashIndex || -1) === fileFlashCount) {
                SetStep(Steps.UEBERPRUEFEN);
            }

            if (step === Steps.UEBERPRUEFEN && data.match("Hash of data verified.")) {
                SetStep(Steps.FERTIG);
            }
        },
        write(data: any) {
            // @ts-ignore
            console.log(data);
            if (data === ConnectionState.CONNECTING) {
                SetState(data);
            }
        }
    };

    useEffect(() => {
        if (device) {
            SetTransport(new Transport(device, false));
        }
    }, [device]);

    useEffect(() => {
        transport &&
            new Promise<void>(async (resolve, reject) => {
                try {
                    const flashOptions = {
                        transport,
                        baudrate: stepData.data.flashConfig?.uploadSpeed || 921600,
                        terminal: espLoaderTerminal
                    } as LoaderOptions;
                    SetEsploader(new ESPLoader(flashOptions));

                    // Temporarily broken
                    // await esploader.flashId();
                } catch (e: any) {
                    console.log(`${e.message}`);
                    SetErrors([`${e.message}`]);
                } finally {
                    resolve();
                }
            });
    }, [transport]);

    useEffect(() => {
        esploader &&
            new Promise<void>(async (resolve, reject) => {
                if (esploader) {
                    try {
                        const lChip = await esploader.main();
                    } catch (e: any) {
                        reject([e.message]);
                    }
                } else {
                    reject(["esploader is not defined when trying to connect"]);
                }

                resolve();
            })
                .then(() => {})
                .catch((reason) => {
                    SetErrors([...reason]);
                });
    }, [esploader]);

    useEffect(() => {
        try {
            // @ts-ignore
            navigator.serial.addEventListener("connect", deviceConnect);

            // @ts-ignore
            navigator.serial.addEventListener("disconnect", deviceDisconnect);
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        if (state === ConnectionState.CONNECTED) {
            if (!wifi) {
                SetStep(Steps.FLASHEN);
            } else {
                SetStep(Steps.CONFIGURE);
            }
        }
    }, [state, wifi]);

    const InstructionPlugIn = () => {
        return (
            <Instruction
                title={Steps.ANSCHLIESSEN}
                content={
                    <div className={" flex flex-col place-content-center h-full"}>
                        <p className={"text-sm  text-center"}>
                            Schließen Sie den ESP mit Hilfe eines USB-Kabels an den PC an.{" "}
                        </p>

                        {Array.isArray(devices) && devices.length > 0 && (
                            <div className={"mt-4"}>
                                <div className={"font-bold"}>Verbundene Geräte:</div>
                                <ol className={"pl-8"}>
                                    {devices.map((device: any, index: number) => {
                                        return (
                                            <li
                                                key={index}
                                                className={"list-decimal"}
                                            >{`Vendor ID: ${device.getInfo().usbVendorId} - Product ID: ${device.getInfo().usbProductId}`}</li>
                                        );
                                    })}
                                </ol>
                            </div>
                        )}
                    </div>
                }
                action={
                    <div
                        className={"btn-primary w-min"}
                        onClick={() => {
                            SetStep(Steps.VERBINDEN);
                        }}
                    >
                        Erledigt
                    </div>
                }
            />
        );
    };

    const InstructionConnect = () => {
        return (
            <Instruction
                title={"Verbinden"}
                content={
                    <div className={" flex flex-col place-content-center h-full"}>
                        {state !== ConnectionState.CONNECTING ? (
                            <>
                                <p className={"text-sm  text-center mb-4"}>
                                    Wählen Sie nun das Gerät zum Verbinden aus.{" "}
                                </p>
                                {stepData.data.flashConfig?.deviceConnectName && (
                                    <p className={"text-sm  text-center"}>
                                        Dies sollte in der Regel der{" "}
                                        <b>
                                            &quot; {stepData.data.flashConfig?.deviceConnectName}{" "}
                                            &quot;
                                        </b>{" "}
                                        sein.{" "}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <span className={"text-xl font-bold text-center"}>
                                    Verbindung wird aufgebaut
                                </span>
                                <div className={"relative flex flex-row justify-center mt-4"}>
                                    <Spinner className={"h-24"}></Spinner>
                                </div>
                            </>
                        )}
                    </div>
                }
                action={
                    <div
                        className={"btn-primary w-fit"}
                        onClick={() => {
                            select();
                        }}
                    >
                        {state === ConnectionState.CONNECTING ? "Auswahl ändern" : "Auswählen"}
                    </div>
                }
            />
        );
    };

    const InstructionConfigure = () => {
        const [wifiSSID, SetWifiSSID] = useState<string>("");
        const [wifiPassword, SetWifiPassword] = useState<string>("");
        const [wifiSec, SetWifiSec] = useState<string>("wpa2");
        const [wifiConfig, SetWifiConfig] = useState<boolean>(false);

        const submitWifiCreds = () => {
            if (wifiConfig && wifiSSID.length > 0 && wifiPassword.length >= 8) {
                SetDeviceConfig(
                    Object.assign(deviceConfig, {
                        features: {
                            wifi: true
                        },
                        wifi: {
                            disabled: false,
                            ssid: wifiSSID,
                            password: wifiPassword,
                            security: wifiSec
                        }
                    })
                );

                SetStep(Steps.FLASHEN);
            } else if (!wifiConfig) {
                SetDeviceConfig(
                    Object.assign(deviceConfig, {
                        features: {
                            wifi: false
                        }
                    })
                );

                SetStep(Steps.FLASHEN);
            }
        };

        return (
            <Instruction
                title={"Konfigurieren"}
                content={
                    <div
                        className={
                            " flex flex-col place-content-start h-full bg-black/10 rounded-lg"
                        }
                    >
                        <div
                            className={
                                "flex flex-row flex-grow-0 flex-shrink-0 font-bold text-lg gap-x-1 bg-zinc-700"
                            }
                        >
                            <div
                                className={
                                    "bg-black/10 px-6 py-4 flex-grow-0 cursor-pointer rounded-t-lg"
                                }
                            >
                                WLAN
                            </div>
                        </div>
                        <form
                            className={
                                "flex-grow-1 overflow-y-auto p-4 gap-y-2 flex flex-col rounded-tr-lg"
                            }
                        >
                            <FieldSetCheckbox
                                label={"Ein / Aus"}
                                onClick={(event: any) => SetWifiConfig(event.currentTarget.checked)}
                                className={"mb-4"}
                            ></FieldSetCheckbox>
                            <FieldSetInput
                                label={"Wlan-Name (SSID)"}
                                disabled={!wifiConfig}
                                required={wifiConfig}
                                onChange={(event: any) => SetWifiSSID(event.currentTarget.value)}
                            />
                            <FieldSetInput
                                label={"Passwort"}
                                type={"password"}
                                disabled={!wifiConfig}
                                required={wifiConfig}
                                onChange={(event: any) =>
                                    SetWifiPassword(event.currentTarget.value)
                                }
                            />
                            <FieldSetSelect
                                label={"Sicherheit"}
                                disabled={!wifiConfig}
                                required={wifiConfig}
                                onChange={(event: any) => SetWifiSec(event.currentTarget.value)}
                            >
                                <optgroup label={"WPA"}>
                                    <option value={"wpa3"}>WPA3 (empfohlen)</option>
                                    <option selected={true} value={"wpa2"}>
                                        WPA2 (standard)
                                    </option>
                                    <option value={"wpa"}>WPA</option>
                                </optgroup>
                                <option value={"wep"}>WEP (nicht empfohlen)</option>
                            </FieldSetSelect>
                        </form>
                    </div>
                }
                action={
                    <div
                        className={`btn-primary w-min ${wifiConfig && !(wifiSSID.length > 0 && wifiPassword.length >= 8) ? "bg-gray-600 cursor-not-allowed" : ""} `}
                        onClick={() => submitWifiCreds()}
                    >
                        Übernehmen
                    </div>
                }
            />
        );
    };

    useEffect(() => {
        if (flashingInProgress && !flashProgress) {
            SetFlashingInProgress(false);
        } else if (flashProgress) {
            SetFlashingInProgress(true);
        }
    }, [flashProgress]);

    const InstructionFlash = () => {
        const SpecInfos = () => {
            return (
                <>
                    {vendorID && <span className={"block"}>VendorID: {vendorID}</span>}
                    {productID && <span className={"block"}>ProductID: {productID}</span>}
                    {hz && <span className={"block"}>Chip Freq.: {hz}</span>}
                </>
            );
        };

        return (
            <Instruction
                title={"Flashen"}
                content={
                    <div
                        className={" flex flex-col gap-4 place-content-center h-full items-center"}
                    >
                        <div className={"flex flex-col items-center gap-2 mb-4"}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                key={"/Espressif_White_Logo_EN_Vertical.svg"}
                                src={"/Espressif_White_Logo_EN_Vertical.svg"}
                                className={"min-w-[42px] w-24 mb-2"}
                            />
                            {chip && <span className={"block font-bold"}>{chip}</span>}
                            {!flashProgress && <SpecInfos />}
                            {(wifi || bt) && (
                                <div className={"flex flex-row gap-2"}>
                                    {bt && (
                                        <span title={"Bluetooth"}>
                                            <svg
                                                className={"h-6 inline fill-white"}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                            >
                                                <path d="M292.6 171.1L249.7 214l-.3-86 43.2 43.1m-43.2 219.8l43.1-43.1-42.9-42.9-.2 86zM416 259.4C416 465 344.1 512 230.9 512S32 465 32 259.4 115.4 0 228.6 0 416 53.9 416 259.4zm-158.5 0l79.4-88.6L211.8 36.5v176.9L138 139.6l-27 26.9 92.7 93-92.7 93 26.9 26.9 73.8-73.8 2.3 170 127.4-127.5-83.9-88.7z" />
                                            </svg>
                                        </span>
                                    )}
                                    {wifi && <WifiIcon className={"h-6 inline"} title={"WLAN"} />}
                                    {wifiMac && <span className={"inline-block"}>{wifiMac}</span>}
                                </div>
                            )}
                        </div>
                        {!flashProgress && (
                            <p className={"text-sm  text-center"}>
                                Nun wird die Firmware aufgespielt.
                            </p>
                        )}
                        {flashProgress && (
                            <>
                                <p className={"text-sm  text-center"}>
                                    Bitte warten Sie bis der Prozess abgeschlossen ist.
                                </p>
                                <ProgressBar progress={flashProgress} />
                            </>
                        )}
                    </div>
                }
                action={
                    <div className={"flex flex-col items-center gap-2"}>
                        <div
                            className={`btn-primary w-max ${flashProgress !== undefined ? "invisible" : "visible"}`}
                            onClick={() => flash()}
                        >
                            Flashen starten
                        </div>
                        <span className={"text-[0.6rem]"}>
                            * All Espressif&apos;s logos are trademarks of Espressif Systems
                            (Shanghai) Co., Ltd.
                        </span>
                    </div>
                }
            />
        );
    };

    const InstructionValidate = () => {
        return (
            <Instruction
                title={"Überprüfung"}
                content={
                    <div className={" flex flex-col place-content-center h-full"}>
                        <p className={"text-sm  text-center"}>
                            Nun wird geprüft ob die Firmware korrekt aufgespielt worden ist.
                            <br /> Bitte warten Sie bis der Prozess abgeschlossen ist.{" "}
                        </p>
                        <div className={"relative flex flex-row justify-center mt-4"}>
                            <Spinner></Spinner>
                        </div>
                    </div>
                }
            />
        );
    };

    const InstructionPreparation = () => {
        return (
            <Instruction
                title={Steps.VORBEREITUNG}
                content={
                    <div className={" flex flex-col place-content-center h-full"}>
                        {
                            // @ts-ignore
                            !window.navigator.serial && (
                                <span className={"text-center text-red-500 font-bold mb-2"}>
                                    {" "}
                                    Nutzen Sie einen unterstützen Browser für diese Funktion!{" "}
                                    <span className={"block"}>Chrome oder Edge ab Version 89 </span>
                                    <span className={"block"}>Opera ab Version 75</span>
                                </span>
                            )
                        }
                        <div>
                            {!!stepData.data.flashConfig && (
                                <BlocksRenderer
                                    content={stepData.data.flashConfig.preRequirementText || []}
                                    className={"text-center"}
                                />
                            )}
                        </div>
                    </div>
                }
                action={
                    // @ts-ignore
                    window.navigator.serial ? (
                        <div
                            className={"btn-primary w-min"}
                            onClick={() => SetStep(Steps.ANSCHLIESSEN)}
                        >
                            Erledigt
                        </div>
                    ) : undefined
                }
            />
        );
    };

    const InstructionComplete = () => {
        return (
            <Instruction
                title={Steps.FERTIG}
                content={
                    <div className={" flex flex-col place-content-center  items-center h-full"}>
                        <div>
                            <CheckBadgeIcon className={"h-32"} />
                        </div>
                        <p className={"text-md text-center font-bold"}>
                            Der Vorgang ist nun abgeschlossen.
                        </p>
                        <ConfettiExplosion
                            duration={5000}
                            width={1200}
                            zIndex={0}
                            height={"120vh"}
                            className={"fixed top-10 left-1/2 w-full"}
                        />
                    </div>
                }
                action={
                    <div className={"btn-primary w-min"} onClick={() => closeFunction()}>
                        Schließen
                    </div>
                }
            />
        );
    };

    const flash = () => {
        SetFlashProgress(0.0);
        new Promise<void>(async (resolve) => {
            const fileArray: any[] = [
                //LittleFS Configs
                {
                    data: await new Promise(async (resolve, reject) => {
                        try {
                            const deviceFetch = await fetchAPI(
                                `/api/thingsboard-plugin/deployment/${stepData.deployment}/device/${stepData.state.device.id}/credentials`,
                                {},
                                {
                                    headers: {
                                        Authorization: `Bearer ${Auth.getToken()}`
                                    }
                                }
                            );
                            const deviceToken = deviceFetch.credentialsId;

                            const response = await fetch(
                                `${getLittleFSURL()}?${qs.stringify({
                                    littlefsSize: parseInt(
                                        stepData.data.flashConfig?.littlefsSize || "0xE0000"
                                    )
                                })}`,
                                {
                                    method: "post",
                                    body: JSON.stringify({
                                        deviceToken: deviceToken,
                                        ...deviceConfig
                                    })
                                }
                            );
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            const arrayBuffer = await response.arrayBuffer();
                            const binaryString = ((buffer) => {
                                let binaryString = "";
                                const bytes = new Uint8Array(buffer);
                                const len = bytes.byteLength;
                                for (let i = 0; i < len; i++) {
                                    binaryString += String.fromCharCode(bytes[i]);
                                }
                                return binaryString;
                            })(arrayBuffer);
                            resolve(binaryString);
                        } catch (error) {
                            console.error("Error fetching the .bin file:", error);
                        }
                    }),
                    address: stepData.data.flashConfig?.littlefsOffset || "0x310000"
                },
                // other files
                ...(await Promise.all(
                    Array.from(stepData.data.flashInstruction).map(async (fI: any) => {
                        return {
                            data: await new Promise(async (resolve, reject) => {
                                try {
                                    const response = await fetch(
                                        getStrapiURLForFrontend(fI.binary.url),
                                        {
                                            cache: "force-cache"
                                        }
                                    );
                                    if (!response.ok) {
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }
                                    const arrayBuffer = await response.arrayBuffer();
                                    const binaryString = ((buffer) => {
                                        let binaryString = "";
                                        const bytes = new Uint8Array(buffer);
                                        const len = bytes.byteLength;
                                        for (let i = 0; i < len; i++) {
                                            binaryString += String.fromCharCode(bytes[i]);
                                        }
                                        return binaryString;
                                    })(arrayBuffer);
                                    resolve(binaryString);
                                } catch (error) {
                                    console.error("Error fetching the .bin file:", error);
                                }
                            }),
                            address: fI.flashAddress
                        };
                    })
                ))
            ];

            //------ validate

            const offsetArr: number[] = [];
            let offset = 0;
            let fileData = null;

            // check for mandatory fields
            for (let index = 0; index < fileArray.length; index++) {
                //offset fields checks
                offset = parseInt(fileArray[index].address);

                // Non-numeric or blank offset
                if (Number.isNaN(offset))
                    console.log(
                        `Offset (${offset}) field in row ` + index + " is not a valid address!"
                    );
                // Repeated offset used
                else if (offsetArr.includes(offset))
                    console.log("Offset field in row " + index + " is already in use!");
                else offsetArr.push(offset);

                const fileObj = fileArray[index].data;
                fileData = fileObj.data;
                if (fileData == null) console.log("No file selected for row " + index + "!");
            }

            //------

            console.log(fileArray);

            try {
                const flashOptions: FlashOptions = {
                    fileArray: fileArray,
                    flashSize: "keep",
                    flashMode: "keep",
                    flashFreq: "keep",
                    eraseAll: false,
                    compress: true,
                    reportProgress: (fileIndex: number, written: number, total: number) => {
                        console.debug(`File ${fileIndex} Progress: ${(written / total) * 100}`);
                        SetFileFlashIndex(fileIndex);
                        SetFileFlashCount(fileArray.length);
                        SetFlashProgress(
                            Math.round(
                                ((written / total) * 100) / fileArray.length +
                                    fileIndex * (100 / fileArray.length)
                            )
                        );
                    },
                    calculateMD5Hash: (image: string): string =>
                        CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)).toString()
                } as FlashOptions;
                console.log(esploader);
                if (esploader) {
                    await esploader.writeFlash(flashOptions);
                } else {
                    throw new Error("esploader is not defined when trying to flash");
                }
            } catch (e: any) {
                console.error(e);
                SetErrors([...errors, `${e.message}`]);
            } finally {
            }

            resolve();
        }).then(() => {
            SetState(FlashState.COMPLETE);
            console.log("complete flash");
        });
    };

    useEffect(() => {
        if (state === FlashState.COMPLETE) {
            SetStep(Steps.FERTIG);
        }
    }, [state]);

    const hardReset = () => {
        if (esploader) {
            esploader.hardReset().then(() => {
                console.log("hard reset");

                if (transport) {
                    transport.disconnect().then(() => {
                        setTimeout(() => {
                            SetState(undefined);
                            SetFlashProgress(undefined);
                            SetFileFlashIndex(undefined);
                            SetFileFlashCount(undefined);
                            SetWifi(false);
                            SetBt(false);
                            SetWifiMac(undefined);
                            SetVendorID(undefined);
                            SetProductID(undefined);
                            SetChip(undefined);
                            SetTransport(undefined);
                            SetEsploader(undefined);
                            SetErrors([]);
                        }, 2000);
                    });
                }
            });
        }
    };

    const closeFunction = () => {
        hardReset();
        !!onClose && onClose(step === Steps.FERTIG);
    };

    return (
        <ModalUI
            name={"ESP Flashen"}
            onClose={() => closeFunction()}
            canClose={!flashingInProgress || step === Steps.FERTIG}
        >
            <div className={"flex flex-row h-auto min-h-32 block items-strech"}>
                <div className={"w-38 pr-4"}>
                    <div className={"border-r border-zinc-500"}>
                        {StepsData.map((s: any, index: number, sarray: any[]) => {
                            return (
                                <Step
                                    key={index}
                                    name={s.name}
                                    note={s.note}
                                    active={step === s.name}
                                    done={
                                        index < sarray.findIndex((f) => step === f.name) ||
                                        step === Steps.FERTIG
                                    }
                                ></Step>
                            );
                        })}
                    </div>
                </div>
                <div className={"w-96 pl-6"}>
                    {step === Steps.VORBEREITUNG && <InstructionPreparation />}
                    {step === Steps.ANSCHLIESSEN && <InstructionPlugIn />}
                    {step === Steps.VERBINDEN && <InstructionConnect />}
                    {step === Steps.CONFIGURE && <InstructionConfigure />}
                    {step === Steps.FLASHEN && <InstructionFlash />}
                    {step === Steps.UEBERPRUEFEN && <InstructionValidate />}
                    {step === Steps.FERTIG && <InstructionComplete />}
                </div>
            </div>
        </ModalUI>
    );
};

const Step = ({
    name,
    note,
    active,
    done
}: {
    name: string;
    note: string;
    active: boolean;
    done: boolean;
}) => {
    return (
        <div className={"flex flex-row items-center justify-end"}>
            <div className={"text-right mb-6 mt-2 pr-4"}>
                <span className={"font-bold block"}>{name}</span>
                <span className={"text-xs block"}>{note}</span>
            </div>
            <div
                className={`block rounded-2xl ${active || done ? "bg-orange-500" : "bg-zinc-700"} w-6 -mr-3 border border-orange-500 aspect-square mb-4 flex flex-col items-center justify-center`}
            >
                {done && <CheckIcon className={"h-4 aspect-square"} />}
            </div>
        </div>
    );
};

const ProgressBar = ({ progress }: { progress?: number }) => {
    return (
        <div
            className={
                "rounded-xl overflow-hidden h-6 bg-white/10 block w-64 mt-4 text-center relative isolate"
            }
        >
            <div className={"text-white z-10"}>{progress || 0}%</div>
            <div
                className={"h-full bg-orange-500 absolute top-0 -z-10 transition-all"}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

const Instruction = ({
    title,
    content,
    action
}: {
    title: string;
    content: React.ReactNode;
    action?: React.ReactNode;
}) => {
    return (
        <div className={"flex flex-col h-full gap-4 place-content-between"}>
            <span className={"block text-2xl font-bold text-center pb-4 flex-grow-0 flex-shrink-0"}>
                {" "}
                {title}
            </span>
            <div className={" flex-grow flex-shrink-0"}>{content}</div>
            {action && (
                <div className={" flex-grow-0 flex-shrink-0 flex flex-row justify-center"}>
                    {action}
                </div>
            )}
        </div>
    );
};

export default FlashProgress;
