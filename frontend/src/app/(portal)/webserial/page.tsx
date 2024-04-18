'use client'
import { WifiIcon } from "@heroicons/react/24/solid";
import { ESPLoader, FlashOptions, LoaderOptions, Transport } from "esptool-js";
import { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";


export default function Page() {


    let device: any = null;
    const [state, SetState] = useState<string | undefined>();
    const [vendorID, SetVendorID] = useState<string | undefined>();
    const [productID, SetProductID] = useState<string | undefined>();
    const [chip, SetChip] = useState<string | undefined>();
    const [wifi, SetWifi] = useState<boolean>(false);
    const [wifiMac, SetWifiMac] = useState<string | undefined>();
    const [hz, SetHz] = useState<string | undefined>();
    const [progress, SetProgress] = useState<number>();
    const [errors, SetErrors] = useState<Array<string>>(new Array<string>());


    const [esploader, SetEsploader] = useState<ESPLoader>();
    const [transport, SetTransport] = useState<Transport>();
   // const filIn = useRef(null);


    useEffect(() => {
        console.log(esploader, transport, state, vendorID, productID, chip, wifi, wifiMac, hz, progress, errors);
    }, [esploader,transport, state, vendorID, productID, chip, wifi, wifiMac, hz, progress, errors])


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
                SetState("Connected")
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
        },
        write(data: any) {
            // @ts-ignore
            console.log(data);
            if(data === "Connecting...") {
                SetState(data);
            }
        },
    };

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

    const ctClick = () => {
            new Promise<void>(async (resolve, reject) => {

                if (device === null) {
                    // @ts-ignore
                    device = await navigator.serial.requestPort({});
                    SetTransport(new Transport(device, false));
                }

            }).then(() => {
                console.log("complete connect")
            });
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
                        SetProgress((written / total) * 100);
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
        if(state === "Complete" && esploader) {
            esploader.hardReset().then(() => {
                console.log("hard reset");

                if(transport) {
                    transport.disconnect().then(() => {
                        setTimeout(() => {
                            SetState(undefined);
                            SetProgress(undefined)
                            SetWifi(false)
                            SetWifiMac(undefined);
                            SetVendorID(undefined);
                            SetProductID(undefined);
                            SetChip(undefined);
                            SetErrors([]);
                        }, 2000)
                    });
                }
            });


        }
    }, [state, transport, esploader])

    return (
        <div className={"bg-zinc-600 relative block"}>

            <div className={"m-16 absolute left-0 top-0 "}>
            { state === "Connected" && (<div className={" px-8 py-4 bg-orange-500 hover:bg-orange-700 text-white rounded cursor-pointer "} onClick={() => flash()}>Flash</div> ) }
            { !state && ( <div className={" px-8 py-4 bg-orange-500 hover:bg-orange-700 text-white rounded cursor-pointer "} onClick={() => ctClick()}>Connect</div> ) }
            </div>

            <div className={"p-2 relative block bg-grey-100 text-right w-1/2 left-1/2"}>
                {state === "Connecting..." && (<span className={"block"}>Verbindung wird hergestellt</span>)}
                {state === "Connected" && (<span className={"block"} >Verbunden</span>)}
                { state === "Flashing" && ( <span className={"block"} >Flashing...</span>)}
                { state === "Complete" && ( <span className={"block text-green-500"} >Flashed!</span>)}
                { chip && ( <span className={"block"}>{chip}</span>)}
                { vendorID && ( <span className={"block"}>VendorID: {vendorID}</span>)}
                { productID && ( <span className={"block"}>ProductID: {productID}</span>)}
                { wifi && ( <WifiIcon className={"h-6 inline"}/> )} { wifiMac && ( <span className={"inline-block"}>{ wifiMac }</span>)}
                { progress && ( <span className={" block"}>Progress: { progress }%</span>)}
                <div className={"mt-8 block"}>
                    { errors.map((value, index, array) => (<span className={"text-red-600 bg-zinc-900 inline-block px-4 py-2"} key={index}>{ value }%</span>))}
                </div>
            </div>
        </div>
    );
}
