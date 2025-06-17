"use client";
import { CpuChipIcon } from "@heroicons/react/20/solid";
import { PencilIcon, PlusIcon, TrashIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import DeviceSetupModal from "@iot-portal/frontend/app/common/DeviceSetupModal";
import FlashProgress from "@iot-portal/frontend/app/common/FlashProcess";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import * as React from "react";
import { useCallback, useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import type { Range } from "react-date-range";
import { addDays } from "date-fns";
import ExportTelemetryModal from "./exportTelemetryModal";

const DeviceBox = ({
    device,
    setup,
    stepData,
    devicesRefresh
}: {
    device: any;
    setup: any;
    stepData: any;
    devicesRefresh: Function;
}) => {
    const [flashModalOpen, toggleFlashModalOpen] = useReducer(
        (prevState: boolean): boolean => !prevState,
        false
    );
    const [editModalOpen, toggleEditModalOpen] = useReducer(
        (prevState: boolean): boolean => !prevState,
        false
    );
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [availableKeys, setAvailableKeys] = useState<string[]>([]);
    const defaultDateRange: Range[] = [
        {
            startDate: addDays(new Date(), -1),
            endDate: new Date(),
            key: "selection"
        }
    ];
    const [dateRange, setDateRange] = useState<Range[]>(defaultDateRange);
    const handleCloseExportModal = () => {
        setExportModalOpen(false);
        setDateRange(defaultDateRange);
    };

    const deleteDevice = useCallback(() => {
        LoadingState.startLoading();
        fetchAPI(
            `/api/thingsboard-plugin/deployment/${setup.id}/${device.id.entityType
                .split("_")[0]
                .toLowerCase()}/${device.id.id}/delete`,
            {},
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }
        ).then(() => {
            LoadingState.endLoading();
            devicesRefresh();
        });
    }, [device, setup]);

    useEffect(() => {
        if (exportModalOpen) {
            const fetchKeys = async () => {
                const deviceId = device.id.id;
                const entityType = device.id.entityType;
                const keysUrl = `/api/thingsboard-plugin/deployment/telemetry/${entityType}/${deviceId}/keys/timeseries`;
                const keys: string[] = await fetchAPI(
                    keysUrl,
                    {},
                    {
                        headers: { Authorization: `Bearer ${Auth.getToken()}` }
                    }
                );
                setAvailableKeys(keys);
            };
            fetchKeys();
        }
    }, [exportModalOpen, device.id.id, device.id.entityType]);

    const exportDeviceData = useCallback(
        async (format: "csv" | "json", selectedKeys: string[]) => {
            const deviceId = device.id.id;
            const entityType = device.id.entityType;
            const startDate = dateRange[0].startDate;
            const endDate = dateRange[0].endDate;

            if (!startDate || !endDate) {
                toast.error("Bitte wähle einen gültigen Zeitraum aus.");
                return;
            }

            if (!selectedKeys || selectedKeys.length === 0) {
                toast.error("Bitte wähle mindestens einen Sensorwert aus.");
                return;
            }

            LoadingState.startLoading();

            try {
                const exportUrl = `/api/thingsboard-plugin/deployment/telemetry/${entityType}/${deviceId}/export?key=${selectedKeys.join(
                    ","
                )}&startTs=${startDate.getTime()}&endTs=${endDate.getTime()}&useStrictDataTypes=true`;
                const data = await fetchAPI(
                    exportUrl,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${Auth.getToken()}`
                        }
                    }
                );

                if (
                    !data ||
                    Object.values(data).every((arr) => !Array.isArray(arr) || arr.length === 0)
                ) {
                    toast.error("Zeitraum enthält keine Sensordaten zum Exportieren.");
                    return;
                }

                // Export raw JSON
                if (format === "json") {
                    const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: "application/json"
                    });
                    const blobUrl = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = blobUrl;
                    link.download = `${device.label.replaceAll(" ", "_")}_telemetry.json`;
                    link.click();
                    URL.revokeObjectURL(blobUrl);

                    toast.success("Sensordaten exportiert.");
                    return;
                }

                // Export as .csv
                const rowMap: Record<number, Record<string, any>> = {};
                // Align by timestamp
                selectedKeys.forEach((key) => {
                    const series = data[key];
                    if (Array.isArray(series)) {
                        series.forEach((entry) => {
                            const ts = entry.ts;
                            if (!rowMap[ts]) rowMap[ts] = { timestamp: ts };
                            rowMap[ts][key] = entry.value;
                        });
                    }
                });

                const rows = Object.values(rowMap).sort((a, b) => a.timestamp - b.timestamp);

                const escapeCSV = (value: any) => {
                    if (value === null || value === undefined) return "";
                    const str = String(value);
                    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                        return `"${str.replace(/"/g, '""')}"`;
                    }
                    return str;
                };

                const headers = ["timestamp", ...selectedKeys];
                const csv = [
                    headers.join(","),
                    ...rows.map((row) => headers.map((h) => escapeCSV(row[h])).join(","))
                ].join("\n");

                const bom = "\uFEFF"; // UTF-8 BOM
                const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8" });
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = `${device.label.replaceAll(" ", "_")}_telemetry.csv`;
                link.click();
                URL.revokeObjectURL(blobUrl);

                toast.success("Sensordaten exportiert.");
            } catch (err) {
                toast.error("Fehler beim Exportieren der Sensordaten.");
            } finally {
                LoadingState.endLoading();
            }
        },
        [device, dateRange]
    );

    return (
        <>
            <div
                className={`bg-gray-500/25 pl-4 pr-2 py-2 flex flex-row items-center ${
                    device.active !== undefined && "border-l-4"
                } ${device.active ? "border-green-500" : "border-red-500"}`}
            >
                <span>{device.label.replace(setup.name + " | ", "")}</span>
                <div className={"flex-shrink-0 ml-auto flex flex-row gap-2"}>
                    {Array.of(...stepData.data.flashInstruction).length > 0 && (
                        <div
                            title={"Flashen"}
                            onClick={toggleFlashModalOpen}
                            className={
                                "p-2 rounded-3xl bg-gray-400/25 hover:bg-blue-600/50 text-white cursor-pointer"
                            }
                        >
                            <CpuChipIcon className={"w-4 aspect-square"} />
                        </div>
                    )}
                    <div
                        title={"Bearbeiten"}
                        onClick={() => toggleEditModalOpen}
                        className={
                            "p-2 rounded-3xl bg-gray-400/25 hover:bg-green-600/50 text-white cursor-pointer"
                        }
                    >
                        <PencilIcon className={"w-4 aspect-square"} />
                    </div>
                    <div
                        title={"Export"}
                        onClick={() => setExportModalOpen(true)}
                        className={
                            "p-2 rounded-3xl bg-gray-400/25 hover:bg-base-300 text-white cursor-pointer"
                        }
                    >
                        <ArrowDownTrayIcon className={"w-4 aspect-square"} />
                    </div>
                    <div
                        title={"Löschen"}
                        onClick={() => deleteDevice()}
                        className={
                            "p-2 rounded-3xl bg-gray-400/25 hover:bg-red-600/50 text-white cursor-pointer"
                        }
                    >
                        <TrashIcon className={"w-4 aspect-square"} />
                    </div>
                </div>
            </div>
            {flashModalOpen && (
                <FlashProgress
                    stepData={{
                        ...stepData,
                        deployment: setup.id,
                        state: { device: { id: device.id.id } }
                    }}
                    onClose={() => toggleFlashModalOpen()}
                />
            )}
            {editModalOpen && (
                <FlashProgress
                    stepData={{
                        ...stepData,
                        deployment: setup.id,
                        state: { device: { id: device.id.id } }
                    }}
                    onClose={() => toggleFlashModalOpen()}
                />
            )}
            {exportModalOpen && typeof window !== "undefined" && (
                <ExportTelemetryModal
                    isOpen={exportModalOpen}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    onCancel={handleCloseExportModal}
                    onConfirm={(format, selectedKeys) => {
                        setExportModalOpen(false);
                        exportDeviceData(format, selectedKeys);
                    }}
                    availableKeys={availableKeys}
                />
            )}
        </>
    );
};

const ProfileBox = ({ profile, setup, stepData }: { profile: any; setup: any; stepData?: any }) => {
    const [devices, SetDevices] = useState<any>();

    const [modalOpen, toggleModalOpen] = useReducer(
        (prevState: boolean): boolean => !prevState,
        false
    );

    const loadDevices = useCallback(() => {
        LoadingState.startLoading();
        fetchAPI(
            `/api/thingsboard-plugin/deployment/${setup.id}/${
                profile.id.entityType.split("_")[0]
            }/${profile.id.id}/components`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }
        ).then((respond) => {
            SetDevices(respond.data);
            LoadingState.endLoading();
        });
    }, [profile, setup]);

    useEffect(() => {
        if (!!setup && !!profile) {
            loadDevices();
        }
    }, [profile, setup]);

    return (
        <div className={`p-4 bg-gray-500/20 rounded`}>
            <div className={"flex flex-row items-center"}>
                <h2 className={"text-xl font-bold flex-shrink"}>
                    {profile.name.replace(setup.name + " | ", "")}
                </h2>
                <div className={"aspect-square flex-shrink-0 ml-auto"}>
                    {!!stepData.data && (
                        <>
                            <div
                                className={
                                    "p-2 rounded-3xl bg-gray-500/25 hover:bg-orange-500/80 text-white cursor-pointer"
                                }
                                onClick={toggleModalOpen}
                            >
                                <PlusIcon className={"w-6 aspect-square"} />
                            </div>
                            {modalOpen && (
                                <DeviceSetupModal
                                    onClose={toggleModalOpen}
                                    config={{
                                        deployment: setup.id,
                                        thingsboard_profile: stepData.data.thingsboard_profile,
                                        form_alternative_label:
                                            stepData.data.form_alternative_label,
                                        form_alternative_label_required:
                                            stepData.data.form_alternative_label_required
                                    }}
                                    step={stepData}
                                    triggerStateRefresh={() => loadDevices()}
                                ></DeviceSetupModal>
                            )}
                        </>
                    )}
                </div>
            </div>
            <p>{profile.description}</p>
            <span className={"mt-2 block"}>Aktuell eingerichtet:</span>
            <div className={"flex flex-col mt-2 gap-1.5"}>
                {Array.isArray(devices) &&
                    devices.map((device: any) => {
                        return (
                            <DeviceBox
                                key={device.id.id}
                                device={device}
                                setup={setup}
                                stepData={stepData}
                                devicesRefresh={loadDevices}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

const Page = ({ params }: { params: { id: number } }) => {
    const [setup, SetSetup] = useState<any>();
    const [setupDeviceProfiles, SetSetupDeviceProfiles] = useState<Array<any>>();

    const [steps, SetSteps] = useState<Array<any>>();

    useEffect(() => {
        LoadingState.startLoading();
        fetchAPI(
            `/api/thingsboard-plugin/deployment/${params.id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }
        ).then((respond) => {
            SetSetup(respond);
            fetchAPI(
                `/api/thingsboard-plugin/deployment/${params.id}/profiles`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Auth.getToken()}`
                    }
                }
            ).then((response) => {
                if (response.complete) {
                    SetSetupDeviceProfiles(response);
                } else {
                    SetSetupDeviceProfiles(response);
                }
                LoadingState.endLoading();
            });

            fetchAPI(
                `/api/thingsboard-plugin/deployment/${params.id}/steps`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Auth.getToken()}`
                    }
                }
            ).then((respond) => {
                SetSteps(
                    Array.of(...respond).filter(
                        (step) => step.__component === "instructions.setup-instruction"
                    )
                );
            });
        });
    }, []);

    return (
        <>
            {Array.isArray(setupDeviceProfiles) && (
                <div className={"grid grid-cols-3 gap-3"}>
                    {setupDeviceProfiles.map((profile: any) => {
                        return (
                            <ProfileBox
                                key={profile.id.id}
                                profile={profile}
                                setup={setup}
                                stepData={{
                                    data: steps?.find(
                                        (step) =>
                                            step.thingsboard_profile.id == profile.id.id &&
                                            step.thingsboard_profile.entityType ==
                                                profile.id.entityType
                                    )
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
};
export default Page;
