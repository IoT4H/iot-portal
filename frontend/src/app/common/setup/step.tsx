"use client"

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import * as HeroIcons from "@heroicons/react/20/solid";
import BlocksRenderer from "@iot-portal/frontend/app/common/BlocksRenderer";
import DeviceSetupModal from "@iot-portal/frontend/app/common/DeviceSetupModal";
import Link from "next/link";
import * as React from "react";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Simulate } from "react-dom/test-utils";

type StepData = {
    state: number | undefined,
    viewStatus: boolean,
    deployment: number,
    data: any,
    updateState: Function
};

const StepStatus = ({color, progress, Icon} : { color: string, progress: number | undefined, Icon: any | undefined }) => {

    const [p, setP] = useState(0);

    useEffect(() => {
        var val = progress || 0;
        var r = 90;
        var c = Math.PI*(r*2);

        if (val < 0) { val = 0;}
        if (val > 100) { val = 100;}

        setP(((100-val)/100)*c);
    }, [, progress])

    const style = useMemo(() => {
        return {
            strokeDashoffset: p,
            transition: "all 0.1s linear",
            strokeWidth: "1em",
            stroke: color
        }
    }, [color, p])

    return (<div className={`w-12 aspect-square rounded-3xl flex items-center justify-center relative `} >
        <svg id="svg" className={"w-12 aspect-square -rotate-90"} viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle id="bar" r="90" cx="100" cy="100" fill="transparent" strokeDasharray="565.48" strokeDashoffset="0" style={style}></circle>
        </svg>
        <div className={`absolute ${progress !== 100 && progress !== undefined ? ' w-8 m-1 ' : 'w-12'} ease delay-150 duration-100 transition-all aspect-square rounded-3xl bg-zinc-500/50 ${progress !== undefined && 'bg-zinc-300/50'}  flex items-center justify-center`} style={progress === 100 ? {backgroundColor: color} : {}} >
            { progress === 100 ? <HeroIcons.CheckIcon className={"w-6 ease delay-150 duration-100 transition-all  aspect-square"}/> : <Icon className={` ${progress && progress > 0 ? ' w-4 ' : 'w-6'} ease delay-150 duration-100 transition-all  aspect-square`}/>}
        </div>
    </div>);
}

export const CheckBox = ({label, init}: {label: string, init: boolean}) => {

    const [check, setCheck] = useState(init);

    return (<label className={"relative cursor-pointer flex gap-2 flex-row items-center p-0.5 group/checkbox"}>
                                    <span className={"h-6 aspect-square border-2 border-orange-500 bg-orange-500/20 group-hover/checkbox:bg-orange-500/40 group/indicator"}>
                                        <CheckIcon className={`w-full aspect-square  ${ check ? 'visible' : 'invisible'}`} />
                                    </span>
        <input type={"checkbox"} className={"absolute opacity-0 h-2 w-2 cursor-pointer "} checked={check} onChange={(e) => setCheck(e.currentTarget.checked)}/>
        {label}
    </label>);
}

export default function Step(stepData: StepData) {


    const [open, toggleOpen] = useReducer((prevState: boolean): boolean => !prevState, false);

    const [progress, SetProgress] = useState<number | undefined>();

    const [color, SetColor] = useState("#f97316");

    const [modalOpen, toggleModalOpen] = useReducer((prevState: boolean): boolean => !prevState, false);


    useEffect(() => {

    } , [])

    const taskForm = useRef();

    useEffect(() => {

        switch (progress) {
            case 100:
                SetColor("#16a34a");
                break;
            default:
                SetColor("#f97316");
        }

        switch (progress) {
            case 0:
                !open && toggleOpen();
                break;
            case 100:
                open && toggleOpen();
                break;
            default:
        }
    }, [,progress])

    return (
        <>
            <div className={`w-full flex flex-row group rounded-2xl bg-zinc-900/50 peer ${progress === 100 && 'done'}`}>
                <div className={"w-16 flex-shrink-0 flex-grow-0 flex flex-col"}>
                    <div className={`w-16 aspect-square p-2 mb-0 bg-zinc-700/80 rounded-l-2xl`}>
                        <StepStatus color={color} progress={stepData.state} Icon={HeroIcons.ShoppingBagIcon}/>
                    </div>
                    <div className={"flex-grow flex flex-row justify-center -mb-8"}>
                        <div className={`h-full border-l border-zinc-500/50 group-[:last-of-type]:hidden `} style={progress === 100 ? {borderColor: color} : {}}></div>
                    </div>
                </div>
                <div className={"w-full"}>
                    <div className={`step-header w-full h-16 flex flex-row bg-zinc-700/80 rounded-r-2xl cursor-pointer`} onClick={() => toggleOpen()}>
                        <div className={"flex-grow flex flex-col justify-center px-2 pl-2"}>
                            <span className={"text-xs align-bottom font-light"}>Step {stepData.data.index}</span>
                            <h1 className={"text-xl font font-bold"}>{ stepData.data.meta.name }</h1>
                        </div>
                        <div className={" flex-grow-0 flex-shrink-0 h-16 aspect-square flex flex-col justify-center items-center"}>
                            { open ? <ChevronUpIcon className={"w-6 aspect-square"}></ChevronUpIcon> :
                            <ChevronDownIcon className={"w-6 aspect-square"}></ChevronDownIcon> }
                        </div>
                    </div>
                    <div className={`step-bodyoverflow-hidden ${!open && 'hidden'}`}>
                        <div className={" mx-2 my-8 "}>
                            <BlocksRenderer content={stepData.data.meta.text}
                            ></BlocksRenderer>
                            {
                                ["instructions.list-instruction"].includes(stepData.data.__component) && (
                                    <form id={"taskForm"} >
                                        <span className={"pb-2 mt-4"}>Zu erledigen: </span>
                                    {
                                        stepData.data.tasks.map((task: any) => {
                                            return <CheckBox key={task.text} label={task.text} init={false} />
                                        })
                                    }

                                    </form>
                                )
                            }
                        </div>
                        <div className={"w-full rounded-br-2xl relative flex flex-row justify-center m-4"}>
                            <div className={"flex flex-row gap-4"}>
                                {
                                    ["instructions.setup-instruction"].includes(stepData.data.__component) && (
                                        <>
                                            <div className={"flex justify-center"}>
                                                <button className={"rounded hover:bg-orange-600 bg-orange-500 text-white px-8 py-2 drop-shadow"} onClick={() => toggleModalOpen()}>Einrichten</button>
                                            </div>
                                            <DeviceSetupModal open={modalOpen} onClose={toggleModalOpen} config={{
                                                deployment: stepData.deployment,
                                                "thingsboard_profile":  stepData.data.thingsboard_profile,
                                                "form_alternative_label": stepData.data.form_alternative_label,
                                            }} step={stepData}></DeviceSetupModal>
                                        </>
                                    )
                                }
                                {
                                    ["instructions.text-instruction", "instructions.list-instruction"].includes(stepData.data.__component) && (
                                        <div className={"flex justify-center"}>
                                            <button className={"rounded hover:bg-orange-600 bg-orange-500 text-white px-8 py-2 drop-shadow shadow-white drop-shadow-xl disabled:bg-zinc-500"}
                                            disabled={
                                                (["instructions.list-instruction"].includes(stepData.data.__component)) ? true : false
                                            }
                                            >Erledigt</button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

}
