"use client"
import { CheckIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { WifiIcon } from "@heroicons/react/24/solid";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import Spinner from "@iot-portal/frontend/app/common/spinner";
import CryptoJS from "crypto-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as React from "react";

import { ESPLoader, FlashOptions, LoaderOptions, Transport } from "esptool-js";
import ConfettiExplosion from "react-confetti-explosion";

const ConfigProgress = ({ onClose } : {onClose?: Function}) => {

    enum Steps {
        VORBEREITUNG = "Vorbereitung",
        ANSCHLIESSEN = "Anschließen",
        VERBINDEN = "Verbinden",
        CONFIGURE = "Konfigurieren",
        FLASHEN = "Flashen",
        UEBERPRUEFEN = "Überprüfung",
        FERTIG = "Abgeschlossen"
    }

    enum ConnectionState {
        CONNECTING = "Connecting...",
        CONNECTED = "Connected"
    }

    const StepsData = [
        {name: Steps.VORBEREITUNG, note: "Treiber installieren"},
        {name: Steps.ANSCHLIESSEN, note: "Verbindung mit PC herstellen"},
        {name: Steps.VERBINDEN, note: "Verbindung herstellen mit ESP"},
        {name: Steps.CONFIGURE, note: "Parameter eingeben"},
        {name: Steps.FLASHEN, note: "Firmware auf ESP laden"},
        {name: Steps.UEBERPRUEFEN, note: "Firmware ist aufgespielt"},
        {name: Steps.FERTIG, note: "Vorgang vollständig"}
    ];


    const [step, SetStep] = useState<Steps>(Steps.VORBEREITUNG);

    const [open, SetOpen] = useState<boolean>(true);

    const [device, SetDevice] = useState<any>(null);
    const [state, SetState] = useState<string | undefined>();
    const [vendorID, SetVendorID] = useState<string | undefined>();
    const [productID, SetProductID] = useState<string | undefined>();
    const [chip, SetChip] = useState<string | undefined>();
    const [wifi, SetWifi] = useState<boolean>(false);
    const [wifiMac, SetWifiMac] = useState<string | undefined>();
    const [hz, SetHz] = useState<string | undefined>();
    const [flashProgress, SetFlashProgress] = useState<number>();
    const [flashingInProgress, SetFlashingInProgress] = useState<boolean>(false);
    const [errors, SetErrors] = useState<Array<string>>(new Array<string>());

    const [ configData, SetConfigData ] = useState<any>(null);


    const [esploader, SetEsploader] = useState<ESPLoader>();
    const [transport, SetTransport] = useState<Transport>();


    const [devices, SetDevices] = useState<any[]>();


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
    }

    const deviceConnect = (event: any) => {
        scanForSerialDevices();
        if(step === Steps.ANSCHLIESSEN) {
            SetStep(Steps.VERBINDEN);
        }
    };

    const StepIndex = (findStep: Steps) => {
        return StepsData.findIndex((f) => findStep === f.name)
    }

    const deviceDisconnect = (event: any) => {
        scanForSerialDevices();
        if(StepsData.findIndex((f) => step === f.name) <= StepIndex(Steps.VERBINDEN) && Array.isArray(devices) && devices.length === 0) { SetStep(Steps.ANSCHLIESSEN); }
        else if(StepsData.findIndex((f) => step === f.name) <= StepIndex(Steps.VERBINDEN)  && Array.isArray(devices) && devices.length > 0 && event.target == device) {
            SetStep(Steps.VERBINDEN);
            SetDevice(undefined);
        } else if(StepsData.findIndex((f) => step === f.name) < StepIndex(Steps.FERTIG)) {
            SetStep(Steps.VERBINDEN);
            SetDevice(undefined);
        }
    }

    const select = () => {
        new Promise<void>(async (resolve, reject) => {
            if (device === null) {
                // @ts-ignore
                SetDevice(await navigator.serial.requestPort({}));

            }
            resolve()
        }).then(() => {

        })
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

            if(data.match(new RegExp(/VendorID|ProductID/i))) {
                SetVendorID(data.match(new RegExp(/(?<=VendorID )(\d|\w)+/i))[0]);
                SetProductID(data.match(new RegExp(/(?<=ProductID )(\d|\w)+/i))[0]);
            }

            if(data.match(new RegExp(/Chip is /i))) {
                SetChip(data.match(new RegExp(/(?<=Chip is ).*/i))[0]);
                SetState(ConnectionState.CONNECTED);
            }

            if(data.match(new RegExp(/Features:.*WiFi/))) {
                SetWifi(true);
            }

            if(data.match(new RegExp(/^MAC:/))) {
                SetWifiMac(data.match(new RegExp(/(?:[0-9a-f]{2}:?){6}/))[0]);
            }

            if(data.match(new RegExp(/(k|m|g)hz/i))) {
                SetHz(data.match(new RegExp(/\d+(k|m|g)hz/i))[0]);
            }

            if(data.match("Hash of data verified.")) {
                SetStep(Steps.FERTIG)
            }
        },
        write(data: any) {
            // @ts-ignore
            console.log(data);
            if(data === ConnectionState.CONNECTING) {
                SetState(data);
            }
        },
    };

    useEffect(() => {
        if(device) {
            SetTransport(new Transport(device, false));
        }
    }, [device]);

    useEffect(() => {

        transport && new Promise<void>(async (resolve, reject) => {

            try {
                const flashOptions = {
                    transport,
                    baudrate: 921600,
                    terminal: espLoaderTerminal,
                } as LoaderOptions;
                SetEsploader(new ESPLoader(flashOptions));

                // Temporarily broken
                // await esploader.flashId();
            } catch (e: any) {
                console.log(`${e.message}`);
                SetErrors([`${e.message}`]);
            } finally {
                resolve()
            }
        });
    }, [transport]);


    useEffect(() => {

        esploader && new Promise<void>(async (resolve, reject) => {

            if(esploader) {
                try {
                    const lChip = await esploader.main();
                } catch (e: any) {
                    reject([e.message]);
                }
            } else {
                reject(["esploader is not defined when trying to connect"]);
            }

            resolve();
        }).then(() => {

        }).catch((reason) => {
            SetErrors([...reason])
        })
    }, [esploader]);

    useEffect(() => {
            // @ts-ignore
            navigator.serial.addEventListener("connect", deviceConnect);

            // @ts-ignore
            navigator.serial.addEventListener("disconnect", deviceDisconnect);
    }, []);

    useEffect(() => {
        if(state === ConnectionState.CONNECTED) {
            SetStep(Steps.CONFIGURE);
        }
    }, [state]);


    const InstructionPlugIn = () => {




        return (
            <Instruction
                title={Steps.ANSCHLIESSEN}
                content={
                    <div className={" flex flex-col place-content-center h-full"}>
                        <p className={"text-sm  text-center"}>Schließen Sie den ESP mit Hilfe eines USB-Kabels an den PC
                            an. </p>

                        {
                            Array.isArray(devices) && devices.length > 0 &&
                            (<div className={"mt-4"}>
                                <div className={"font-bold"}>Verbundene Geräte:</div>
                                <ol className={"pl-8"}>{devices.map((device: any, index: number) => {
                                    return (<li key={index}
                                                className={"list-decimal"}>{`Vendor ID: ${device.getInfo().usbVendorId} - Product ID: ${device.getInfo().usbProductId}`}</li>)
                                })
                                }</ol>
                            </div>)

                        }
                    </div>
                }
                action={<div className={"btn-primary w-min"} onClick={() => {
                    SetStep(Steps.VERBINDEN);
                }}>Erledigt</div>} />
        );
    }

    const InstructionConnect = () => {

        return (
            <Instruction
                title={"Verbinden"}
                content={
                    <div className={" flex flex-col place-content-center h-full"}>
                        {
                            state !== ConnectionState.CONNECTING ?
                                <><p className={"text-sm  text-center mb-4"}>Wählen Sie nun den ESP zum Verbinden aus. </p>
                                    <p className={"text-sm  text-center"}>Dies sollte in der Regal der <b>&quot; CP2102 USB to
                                        UART Bridge Controller &quot;</b> sein. </p></> :
                                <>
                                    <span className={"text-xl font-bold text-center"}>Verbindung wird auf gebaut</span>
                                    <div className={"relative flex flex-row justify-center mt-4"}><Spinner ></Spinner></div>
                                </>
                        }
                    </div>
                }
                action={<div className={"btn-primary w-min"} onClick={() => {
                    select();
                }}>Auswählen</div>} />
        );
    }

    const InstructionConfigure = () => {

        const [ssid, SetSSID] = useState("");
        const [wifiPassword, SetWifiPassword] = useState("");
        const [wifitype, SetWifiType] = useState("");

        const [pullingBinary, SetPullingBinary] = useState<boolean>(false);

        const pullDataAsBinary = () => {

            SetPullingBinary(true);
            fetch("/ConfigFile.bin", {
                method: "GET",
                headers: {
                    'Accept':  '*/*'
                },
                body: JSON.stringify({
                    wifi: {
                        ssid: ssid,
                        password: wifiPassword,
                        type: wifitype
                    }
                }),
            }).then((data) => {
                SetConfigData(data.arrayBuffer());
                SetStep(Steps.FLASHEN);
            }).finally(() => {
                SetPullingBinary(false);
            })
        }

        return (
            <Instruction
                title={"Konfigurieren"}
                content={
                    <div className={" flex flex-col place-content-center h-full"}>

                        <h2 className={"text-xl font-bold"}>WLAN Einstellungen</h2>
                        <div className={"my-2"}>
                            <label>WLAN-Name (SSID)</label>
                            <input type={"text"} name={"ssid"}
                                   className={"bg-gray-50/50 border-gray-500/50 my-2 rounded"}
                                   placeholder={"WLAN Name...."} onChange={(event) => SetSSID(event.currentTarget.value)}/>
                        </div>
                        <div className={"my-2"}>
                            <label>WLAN Passwort</label>
                            <input type={"password"} name={"password"}  onChange={(event) => SetWifiPassword(event.currentTarget.value)}
                                   className={"bg-gray-50/50 border-gray-500/50 my-2 rounded"}
                                   placeholder={"WLAN Name...."}/>
                        </div>

                        <div className={"my-2"}>
                            <label>WLAN-Name (SSID)</label>
                            <select name={"type"}  onChange={(event) => SetWifiType(event.currentTarget.value)}
                                    className={"bg-gray-50/50 border-gray-500/50 my-2 rounded block"}
                                    placeholder={"WLAN Name...."}>
                                <option className={"bg-gray-50/50 border-gray-500/50 my-2 rounded"} value={"open"}>Offen</option>
                                <option className={"bg-gray-50/50 border-gray-500/50 my-2 rounded"} value={"wep"}>WEP</option>
                                <option className={"bg-gray-50/50 border-gray-500/50 my-2 rounded"} value={"wpa"}>WPA/WPA2/WPA3</option>
                            </select>
                        </div>
                        <>
                            {
                                pullingBinary && (<Spinner />)
                            }
                        </>
                    </div>

                }
                action={<div className={"btn-primary w-min"} onClick={() => {
                    pullDataAsBinary();
                }}>Auswählen</div>}/>
        );
    }

    useEffect(() => {

        if (flashingInProgress && !flashProgress) {
            SetFlashingInProgress(false);
        } else if(flashProgress) {
            SetFlashingInProgress(true);
        }
    }, [flashProgress]);

    const InstructionFlash = () => {

        return (
            <Instruction
                title={"Flashen"}
                content={
                    <div className={" flex flex-col place-content-center h-full items-center"}>
                        <div className={"flex flex-col items-center gap-2 mb-4"}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={"/Espressif_White_Logo_EN_Vertical.svg"} className={"min-w-[42px] w-24 mb-2"}/>
                            { chip && ( <span className={"block font-bold"}>{chip}</span>)}
                            { !flashingInProgress && vendorID && ( <span className={"block"}>VendorID: {vendorID}</span>)}
                            { !flashingInProgress && productID && ( <span className={"block"}>ProductID: {productID}</span>)}
                            { wifi && ( <div className={"flex flex-row gap-2"}> <WifiIcon className={"h-6 inline"}/> { wifiMac && ( <span className={"inline-block"}>{ wifiMac }</span>)} </div>)}

                        </div>
                        { !flashingInProgress && <p className={"text-sm  text-center"}>Nun wird die Firmware aufgespielt.</p> }
                        { flashingInProgress && <>
                            <p className={"text-sm  text-center"}>Bitte warten Sie bis der Prozess abgeschlossen ist.</p>
                            <ProgressBar progress={flashProgress}/>
                        </>}
                    </div>
                }
                action={<div className={"flex flex-col items-center gap-2"}>
                    <div className={"btn-primary w-max"} onClick={() => flash()}>Flashen starten
                    </div>
                    <span className={"text-[0.6rem]"}>* All Espressif&apos;s logos are trademarks of Espressif Systems (Shanghai) Co., Ltd.</span>
                </div>}/>
        );
    }

    const InstructionValidate = () => {
        return (
            <Instruction
                title={"Überprüfung"}
                content={
                    <div className={" flex flex-col place-content-center h-full"}>
                        <p className={"text-sm  text-center"}>Nun wird geprüft ob die Firmware korrekt aufgespielt
                            worden ist.<br/> Bitte warten Sie bis der Prozess abgeschlossen ist. </p>
                        <div className={"relative flex flex-row justify-center mt-4"}><Spinner></Spinner></div>
                    </div>
                }
            />
        );
    }

    const InstructionPreparation = () => {
        return (
            <Instruction
                title={Steps.VORBEREITUNG}
                content={

                        <div className={" flex flex-col place-content-center h-full"}>
                            {
                            // @ts-ignore
                            window.navigator.serial && (<span className={"text-center text-red-500 font-bold mb-2"}> Nutzen Sie einen unterstützen Browser für diese Funktion! <span className={"block"}>Chrome oder Edge ab Version 89 </span><span className={"block"}>Opera ab Version 75</span></span>)
                        }
                            <ArrowDownTrayIcon className={"h-16 mb-8"} />
                            <p className={"text-sm  text-center"}>
                                Stellen Sie sicher, dass der notwendige Treiber installiert ist.<br/> <br/>
                                Sie können diesen <a href={"https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads"} target={"_blank"} className={"underline underline-offset-2 text-orange-500 font-bold"}>hier</a> bei Silicon Labs herunterladen. </p>
                        </div>}
                action={// @ts-ignore
                    window.navigator.serial ? <div className={"btn-primary w-min"} onClick={() => SetStep(Steps.ANSCHLIESSEN)}>Erledigt</div> : undefined} />
        );
    }

    const InstructionComplete = () => {
        return (
            <Instruction
                title={Steps.FERTIG}
                content={
                    <div className={" flex flex-col place-content-center  items-center h-full"}>
                        <div><CheckBadgeIcon className={"h-32"}/></div>
                        <p className={"text-md text-center font-bold"}>Der Vorgang ist nun abgeschlossen.</p>
                        <ConfettiExplosion duration={5000} width={1200} zIndex={0} height={'120vh'} className={"fixed top-10 left-1/2 w-full"}/>
                    </div>
                }
                action={<div className={"btn-primary w-min"} onClick={() => closeFunction()}>Schließen</div>} />
        );
    }




    const flash = () => {
        new Promise<void>(async (resolve) => {

            // @ts-ignore
            const [fileHandle] = await window.showOpenFilePicker();
            const file = await fileHandle.getFile();

            const reader = new FileReader();


            const fileArray: any[] = [{data: await new Promise((resolve, reject) => {
                    reader.onload = (ev: ProgressEvent<FileReader>) => {
                        ev.target ? resolve(ev.target.result) : reject()
                    };

                    reader.readAsBinaryString(file);
                }), address: 0x0000}];

            //------ validate


            const offsetArr: number[] = [];
            let offset = 0;
            let fileData = null;

            // check for mandatory fields
            for (let index = 0; index < fileArray.length; index++) {

                //offset fields checks
                const offSetObj = fileArray[index].address;
                offset = parseInt(offSetObj.value);

                // Non-numeric or blank offset
                if (Number.isNaN(offset)) console.log( "Offset field in row " + index + " is not a valid address!");
                // Repeated offset used
                else if (offsetArr.includes(offset)) console.log( "Offset field in row " + index + " is already in use!");
                else offsetArr.push(offset);

                const fileObj = fileArray[index].data;
                fileData = fileObj.data;
                if (fileData == null) console.log( "No file selected for row " + index + "!");
            }



            //------


            console.log(fileArray)

            try {
                const flashOptions: FlashOptions = {
                    fileArray: fileArray,
                    flashSize: "keep",
                    flashMode: "keep",
                    flashFreq: "keep",
                    eraseAll: false,
                    compress: true,
                    reportProgress: (fileIndex: number, written: number, total: number) => {
                        console.debug(`File ${fileIndex} Progress: ${(written / total) * 100}`)
                        SetFlashProgress(Math.round((written / total) * 100));
                    },
                    calculateMD5Hash: (image: string): string => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)).toString(),
                } as FlashOptions;
                console.log(esploader)
                if(esploader) {
                    await esploader.writeFlash(flashOptions);
                } else {
                    throw new Error("esploader is not defined when trying to flash");
                }
            } catch (e: any) {
                console.error(e);
                SetErrors([ ...errors, `${e.message}`]);
            } finally {
            }


            resolve();
        }).then(() => {
            SetState("Complete")
            console.log("complete flash")
        })


    }

    useEffect(() => {
        if(state === "Complete") {
            SetStep(Steps.FERTIG);
        }
    }, [state]);

    const hardReset = () => {
        if(esploader) {
            esploader.hardReset().then(() => {
                console.log("hard reset");

                if(transport) {
                    transport.disconnect().then(() => {
                        setTimeout(() => {
                            SetState(undefined);
                            SetFlashProgress(undefined)
                            SetWifi(false)
                            SetWifiMac(undefined);
                            SetVendorID(undefined);
                            SetProductID(undefined);
                            SetChip(undefined);
                            SetTransport(undefined);
                            SetEsploader(undefined);
                            SetErrors([]);
                        }, 2000)
                    });
                }
            });
        }
    }

    const closeFunction = () => {
        hardReset();
        onClose && onClose(step === Steps.FERTIG);
    }


    return  <ModalUI name={"ESP Flashen"} onClose={() => closeFunction()}>


        <div className={"flex flex-row h-auto min-h-32 block items-strech"}>
            <div className={"w-38 pr-4"}>
                <div className={"border-r border-zinc-500"}>
                    {
                        StepsData.map((s: any, index: number, sarray: any[]) => {
                            return (<Step key={index} name={s.name} note={s.note} active={step === s.name}
                                      done={index < sarray.findIndex((f) => step === f.name) || step === Steps.FERTIG}></Step>);
                        })
                    }
                </div>
            </div>
            <div className={"w-96 pl-6"}>
                { step === Steps.VORBEREITUNG && (<InstructionPreparation />) }
                { step === Steps.ANSCHLIESSEN && (<InstructionPlugIn />) }
                { step === Steps.VERBINDEN && (<InstructionConnect />) }
                { step === Steps.CONFIGURE && (<InstructionConfigure />) }
                { step === Steps.FLASHEN && (<InstructionFlash />) }
                { step === Steps.UEBERPRUEFEN && (<InstructionValidate />) }
                { step === Steps.FERTIG && (<InstructionComplete />) }
            </div>
        </div>

    </ModalUI>;


}









const Step = ({name, note, active, done} : {name: string, note: string, active: boolean, done: boolean}) => {

    return (
        <div className={"flex flex-row items-center justify-end"}>
            <div className={"text-right mb-6 mt-2 pr-4"}>
                <span className={"font-bold block"}>{name}</span>
                <span className={"text-xs block"}>{note}</span>
            </div>
            <div className={`block rounded-2xl ${(active || done ) ? "bg-orange-500" : 'bg-zinc-700'} w-6 -mr-3 border border-orange-500 aspect-square mb-4 flex flex-col items-center justify-center`}>
                { done && (<CheckIcon className={"h-4 aspect-square"} />) }
            </div>
        </div>
    )
}

const ProgressBar = ({progress}:{progress?: number}) => {
    return (<div
        className={"rounded-xl overflow-hidden h-6 bg-white/10 block w-64 mt-4 text-center relative isolate"}>
        <div className={"text-white z-10"}>{progress || 0}%</div>
        <div className={"h-full bg-orange-500 absolute top-0 -z-10 transition-all"} style={{width: `${progress}%`}}></div>
    </div>);
}



const Instruction = ({title, content, action}: { title: string, content: React.ReactNode, action?: React.ReactNode }) => {
    return (
        <div className={"flex flex-col h-full pb-8 place-content-between"}>
            <span className={"block text-2xl font-bold text-center pb-4 flex-grow-0 flex-shrink-0"}> { title }</span>
            <div className={" flex-grow flex-shrink-0"}>
                    { content }
            </div>
            { action && (<div className={" flex-grow-0 flex-shrink-0 flex flex-row justify-center"}>{ action }</div> ) }
        </div>
    );
}


export default ConfigProgress;
