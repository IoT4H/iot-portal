"use client";

import { CheckIcon } from "@heroicons/react/24/solid";
import * as React from "react";
import { createRef, useEffect, useReducer, useRef, useState } from "react";

export function RequiredStar(p: any) {
    const { children, ...props } = p;

    return (
        <span {...props} className={`text-orange-500 ml-0.5 text-xl ${props.className}`}>
            *{children}
        </span>
    );
}

export function FieldSetInput(p: any) {
    const { children, ...props } = p;

    return (
        <div className={`relative flex flex-col h-auto ${props.className || ""}`}>
            <label
                htmlFor={props.id}
                className="block font-bold text-base leading-7 text-gray-900 dark:text-orange-50"
            >
                {props.label}
                {props.required && <RequiredStar />}
            </label>
            <div className="mt-2">
                {props.multiline ? (
                    <textarea
                        name={props.id}
                        {...props}
                        className=" block h-[5em] resize-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6 disabled:bg-gray-500 disabled:ring-gray-800"
                    ></textarea>
                ) : (
                    <input
                        name={props.id}
                        {...props}
                        className=" flex-grow block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6 disabled:bg-gray-500 disabled:ring-gray-800"
                    />
                )}
            </div>
            {children &&
                ((Array.isArray(children) &&
                    children.map((child: any) => {
                        return child;
                    })) ||
                    children)}
        </div>
    );
}

export function FieldSetSelect(p: any) {
    const { children, ...props } = p;

    return (
        <div className={`relative flex flex-col ${props.className || ""}`}>
            {props.label && (
                <label
                    htmlFor={props.id}
                    className="block font-bold text-base leading-7 text-gray-900 dark:text-orange-50"
                >
                    {props.label}
                    {props.required && <RequiredStar />}
                </label>
            )}
            <select
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6  disabled:bg-gray-500 disabled:ring-gray-800"
                {...props}
            >
                {(Array.isArray(children) &&
                    children.map((child: any) => {
                        return child;
                    })) ||
                    children}
            </select>
        </div>
    );
}

export function FieldSetCheckbox(p: any) {
    const { children, ...props } = p;

    return (
        <>
            <div className={`relative block group/checkbox ${props.className || ""}`}>
                <label
                    htmlFor={props.id}
                    className={`relative flex gap-2 flex-row items-center p-0.5 group/checkbox group-[:not(:has(*:disabled))]/checkbox:cursor-pointer`}
                >
                    <span
                        className={`h-6 aspect-square border-2 border-orange-500 bg-orange-500/20 group-[:has(*:checked)]/checkbox:bg-orange-500 group-[:not(:has(*:disabled))]/checkbox:group-hover/checkbox:bg-orange-500/40 `}
                    >
                        <CheckIcon
                            className={`w-full aspect-square invisible group-[:has(*:checked)]/checkbox:visible`}
                        />
                    </span>
                    <input type={"checkbox"} {...props} className={"hidden"} />
                    <div>
                        {props.label ||
                            (Array.isArray(children) &&
                                children.map((child: any) => {
                                    return child;
                                })) ||
                            children}
                        {props.required && <RequiredStar />}
                    </div>
                </label>
            </div>
        </>
    );
}

export function FieldSetPatternInput(p: any) {
    const { children, pattern, onChange, ...props } = p;

    const [inputMaskParts, SetInputMaskParts] = useState<RegExpMatchArray | null>(
        pattern.match(/(?:\[[a-zA-Z0-9\-\^]+\](?:\{[0-9,]+\})?|.)/gm)
    );

    const [output, SetOutput] = useState<string>("");

    const outputRef = useRef<HTMLInputElement>(null);

    const [indexs, SetIndexs] = useState<number[]>([]);

    const [inputArray, SetInputArray] = useReducer(
        (state: string[], action: { type: "init" | "update"; index?: number; value: any }) => {
            if (action.type === "init") {
                console.log(state, action);
                return action.value;
            } else if (action.type === "update" && action.index !== undefined) {
                const c = state;
                c[action.index] = action.value;
                console.log("refreshed", c, action);
                SetOutput((c || []).join(""));
                return c;
            } else {
                console.log("???: ", state, action);
            }
        },
        []
    );

    const [elRefs, setElRefs] = React.useState<any[]>([]);

    useEffect(() => {
        if (inputArray?.length === 0) {
            const initArray = new Array((inputMaskParts || []).length).fill(null);
            // add or remove refs
            setElRefs((elRefs) =>
                initArray.map((_, i) => elRefs[i] || createRef<HTMLInputElement>())
            );

            SetInputArray({ type: "init", value: initArray });
        }
        const setOfIndicies: number[] = [];
        (inputMaskParts || []).forEach((p, i, a) => {
            if (p.startsWith("[")) {
                setOfIndicies.push(i);
                SetInputArray({ type: "update", index: i, value: "" });
            } else if (p === "/") {
                SetInputArray({ type: "update", index: i, value: "" });
            } else {
                SetInputArray({ type: "update", index: i, value: p });
            }
        });
        SetIndexs(setOfIndicies);
    }, [inputMaskParts]);

    useEffect(() => {
        p.onChange(output);
    }, [output]);

    return (
        <div className={`relative flex flex-col h-auto ${props.className || ""}`}>
            <label
                htmlFor={props.id}
                className="block font-bold text-base leading-7 text-gray-900 dark:text-orange-50"
            >
                {props.label}
                {props.required && <RequiredStar />}
            </label>
            <div className="mt-2">
                <div
                    className={
                        " font-mono text-black bg-white rounded-md focus-within:ring-2 ring-amber-500 w-max overflow-hidden px-1 has-[:invalid]:ring-red-500 has-[:invalid]:ring-2"
                    }
                >
                    <input
                        type={"text"}
                        ref={outputRef}
                        className={"hidden"}
                        value={output}
                        required={props.required}
                        pattern={pattern}
                    />
                    {(inputMaskParts || []).map((p, i, a) => {
                        if (p.startsWith("[")) {
                            let amount = 1;
                            const checkAmount = p.match(/(?<=\{)\d+(?=\})/);
                            if (checkAmount) {
                                amount = Number(checkAmount);
                            }
                            return (
                                <>
                                    <input
                                        key={i}
                                        ref={elRefs[i]}
                                        onChange={(event) => {
                                            SetInputArray({
                                                type: "update",
                                                index: i,
                                                value: event.currentTarget.value
                                            });

                                            // if(event.currentTarget.validity) {
                                            //     let fi = indexs.findIndex((v, vi, va) => v === i);
                                            //     console.log(fi, i, "find index");
                                            //     if(fi !== -1) {
                                            //         let refI = indexs[fi + 1];
                                            //         console.log(refI, fi, "ref index");
                                            //         console.log(elRefs[refI]);
                                            //     }
                                            // }
                                        }}
                                        className={
                                            "font-mono text-black border-0 outline-0 ring-0 border-b-2 border-grey-500/80 focus:outline-0 focus:ring-0 invalid:bg-red-300 box-content px-1"
                                        }
                                        type={"text"}
                                        style={{ width: `${amount}ch` }}
                                        maxLength={amount}
                                        minLength={amount}
                                        pattern={p}
                                    />
                                </>
                            );
                        } else if (p === "/") {
                            return <></>;
                        } else {
                            return (
                                <span key={i} className={" font-mono text-gray-400"}>
                                    {p}
                                </span>
                            );
                        }
                    })}
                </div>
            </div>
            {children &&
                ((Array.isArray(children) &&
                    children.map((child: any) => {
                        return child;
                    })) ||
                    children)}
        </div>
    );
}
