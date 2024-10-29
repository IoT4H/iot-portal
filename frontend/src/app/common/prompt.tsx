"use client"
import {
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    QuestionMarkCircleIcon,
    InformationCircleIcon
} from "@heroicons/react/24/solid";
import { createPortal } from "react-dom";

export enum PromptType { Default, Request , Warning , Error }

export type PromptAction = { text: string, actionFunction: Function };

export type PromptContext = {
    type: PromptType, text: string, actions : PromptAction[], onClose: Function, title?: string
}

export const Prompt = (context: PromptContext) => {

    const HeadlineIcon = () => {
        switch (context.type) {
            case PromptType.Request:
                return <QuestionMarkCircleIcon className={"h-8 aspect-square inline"}/> ;
                break;
            case PromptType.Error:
                return <ExclamationTriangleIcon className={"h-8 aspect-square inline"}/> ;
                break;
            case PromptType.Warning:
                return <ExclamationCircleIcon className={"h-8 aspect-square inline"}/> ;
                break;
            case PromptType.Default:
            default:
                return <InformationCircleIcon className={"h-8 aspect-square inline"}/> ;
        }
    }

    const headline = () => {
        if(context.title) {
            return context.title;
        }

        switch (context.type) {
            case PromptType.Request:
                return "Aufforderung";
                break;
            case PromptType.Error:
                return "Fehler";
                break;
            case PromptType.Warning:
                return "Warnung";
                break;
            case PromptType.Default:
            default:
                return "Information";
        }
    }

    const headlineColor = () => {
        switch (context.type) {
            case PromptType.Error:
                return "text-red-500";
                break;
            case PromptType.Warning:
                return "text-orange-500";
                break;
            case PromptType.Request:
            case PromptType.Default:
            default:
                return "text-white";
        }
    }

    const headers = () => {
            return <div className={`flex flex-row gap-3 ${headlineColor()}`}><HeadlineIcon/> { headline() }</div>
    }


   return createPortal(
        <div className={"absolute mx-auto my-auto bg-orange-100 dark:bg-zinc-700 rounded min-w-[30vw] md:max-w-xl first:flex flex-col gap-3 overflow-hidden shadow-orange-100/90 dark:shadow-zinc-700/90 shadow-2xl"}>
            <div className={"px-6 py-3 font-bold text-2xl bg-orange-200 dark:bg-zinc-800/90"}>
               {
                   headers()
               }
            </div>
            <div className={"px-6 py-3 text-center"}>
                { context.text }
            </div>
            <div className={"px-6 py-3 flex flex-row gap-8 justify-around"}>
                { context.actions.map((action) => {
                    return <div key={action.text} onClick={() => { action.actionFunction && action.actionFunction(); context.onClose() }} className={"bg-orange-500/50 hover:bg-orange-500 cursor-pointer p-3 px-8 w-full text-center rounded"}>{action.text}</div>
                })}
            </div>
        </div>, document.getElementById("promptArea")!)
}
