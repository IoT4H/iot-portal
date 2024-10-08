"use client"


import { CheckIcon } from "@heroicons/react/24/solid";
import * as React from "react";

export function RequiredStar (p: any) {

    let { children , ...props} = p;

    return <span {...props} className={`text-orange-500 ml-0.5 text-xl ${props.className}`}>*{ children }</span>;
}

export function FieldSetInput(p: any) {

    let {children, ...props }  = p;

    return (
        <div className={`relative flex flex-col h-auto ${props.className || ""}`}>
            <label htmlFor={props.id} className="block font-bold text-base leading-7 text-gray-900 dark:text-orange-50">
                {props.label}{props.required && (<RequiredStar />)}
            </label>
            <div className="mt-2">
                { props.multiline ?
                    <textarea name={props.id} {...props} className="block h-[5em] resize-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6"></textarea> :
                    <input name={props.id} {...props} className=" flex-grow block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6" />
                }
            </div>
                { children && ( Array.isArray(children ) &&  children.map((child: any) => {
                    return child;
                }) || children ) }
        </div>
    );
}


export function FieldSetSelect(p: any) {

    let {children, ...props }  = p;

    return (
        <div className={`relative flex flex-col ${props.className || ""}`}>
            { props.label && ( <label htmlFor={props.id} className="block font-bold text-base leading-7 text-gray-900 dark:text-orange-50">
                {props.label}{props.required && (<RequiredStar />)}
            </label> ) }
            <select className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6">
                { Array.isArray(children ) &&  children.map((child: any) => {
                    return child;
                }) || children }
            </select>
        </div>
    );
}

export function FieldSetCheckbox(p: any) {

    let { children, ...props}  = p;

    return (
        <>
            <div className={`relative block group/checkbox ${props.className || ""}`}>
                <label htmlFor={props.id}
                    className={`relative flex gap-2 flex-row items-center p-0.5 group/checkbox group-[:not(:has(*:disabled))]/checkbox:cursor-pointer`}>
                                        <span
                                            className={`h-6 aspect-square border-2 border-orange-500 bg-orange-500/20 group-[:has(*:checked)]/checkbox:bg-orange-500 group-[:not(:has(*:disabled))]/checkbox:group-hover/checkbox:bg-orange-500/40 `}>
                                            <CheckIcon className={`w-full aspect-square invisible group-[:has(*:checked)]/checkbox:visible`}/>
                                        </span>
                    <input type={"checkbox"} {...props} className={"hidden"} />
                    <div>
                        { Array.isArray(children ) &&  children.map((child: any) => {
                            return child;
                        }) || children }
                        {props.required && (<RequiredStar />)}</div>
                </label>
            </div>
        </>
    );
}
