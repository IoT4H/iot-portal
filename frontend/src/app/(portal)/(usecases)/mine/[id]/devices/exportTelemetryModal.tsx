"use client";
import { createPortal } from "react-dom";
import { DefinedRange, createStaticRanges } from "react-date-range";
import type { Range, RangeKeyDict } from "react-date-range";
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import "./exportTelemetryModal.css";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

type Props = {
    isOpen: boolean;
    dateRange: Range[];
    setDateRange: (range: Range[]) => void;
    onCancel: () => void;
    onConfirm: (format: "csv" | "json") => void;
};

const customStaticRanges = createStaticRanges([
    { label: "Heute", range: () => ({ startDate: new Date(), endDate: new Date() }) },
    {
        label: "Gestern",
        range: () => {
            const yesterday = addDays(new Date(), -1);
            return { startDate: yesterday, endDate: yesterday };
        },
    },
    {
        label: "Diese Woche",
        range: () => ({
            startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
            endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
        }),
    },
    {
        label: "Letzte Woche",
        range: () => {
            const start = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), -7);
            const end = addDays(endOfWeek(new Date(), { weekStartsOn: 1 }), -7);
            return { startDate: start, endDate: end };
        },
    },
    {
        label: "Dieser Monat",
        range: () => ({
            startDate: startOfMonth(new Date()),
            endDate: endOfMonth(new Date()),
        }),
    },
    {
        label: "Letzter Monat",
        range: () => {
            const start = startOfMonth(addDays(new Date(), -30));
            const end = endOfMonth(addDays(new Date(), -30));
            return { startDate: start, endDate: end };
        },
    },
]);

const customInputRanges = [
    {
        label: "⏳ Tage bis heute",
        range(value: number) {
            return {
                startDate: addDays(new Date(), -value),
                endDate: new Date(),
            };
        },
        getCurrentValue(range: Range) {
            if (!range.startDate || !range.endDate) return "";
            const days = Math.round(
                (new Date().getTime() - range.startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            return days >= 0 ? days : "";
        },
    },
    {
        label: "🚀 Tage ab heute",
        range(value: number) {
            return {
                startDate: new Date(),
                endDate: addDays(new Date(), value),
            };
        },
        getCurrentValue(range: Range) {
            if (!range.startDate || !range.endDate) return "";
            const days = Math.round(
                (range.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            return days >= 0 ? days : "";
        },
    },
];

const ExportTelemetryModal = ({
    isOpen,
    dateRange,
    setDateRange,
    onCancel,
    onConfirm
}: Props) => {
    if (!isOpen || typeof window === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            onClick={onCancel}
        >
            <div
                className="bg-base-300 p-6 rounded-md shadow-lg max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-4">Telemetrie-Daten Exportieren</h2>
                <label className="text-sm block mb-2">Zeitraum auswählen:</label>
                <DefinedRange
                    onChange={(item: RangeKeyDict) => setDateRange([item.selection])}
                    ranges={dateRange}
                    staticRanges={customStaticRanges}
                    inputRanges={customInputRanges}
                />
                <div className="mt-4 flex justify-end gap-2 flex-wrap">
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-4 rounded"
                        onClick={onCancel}
                    >
                        Abbrechen
                    </button>

                    <div className="inline-flex rounded-md shadow overflow-hidden border border-primary">
                        <button
                            onClick={() => onConfirm("csv")}
                            className="bg-primary text-white px-4 py-1 flex items-center gap-1 brightness-90 hover:brightness-100 rounded-l-md transition-colors"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            CSV
                        </button>
                        <button
                            onClick={() => onConfirm("json")}
                            className="bg-white text-primary border-l border-primary px-4 py-1 brightness-90 hover:brightness-100 rounded-r-md transition-colors"
                        >
                            JSON
                        </button>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default ExportTelemetryModal;
