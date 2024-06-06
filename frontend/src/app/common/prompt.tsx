"use client"
import {
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    QuestionMarkCircleIcon,
    InformationCircleIcon
} from "@heroicons/react/24/solid";

export enum PromptType { Default, Request , Warning , Error }

export type PromptAction = { text: string, actionFunction: Function };

export type PromptContext = {
    type: PromptType, text: string, actions : PromptAction[], onClose: Function
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


   return (
        <div className={"hidden bg-zinc-700 rounded-xl min-w-[30vw] first:flex flex-col gap-3 overflow-hidden shadow-zinc-700/90 shadow-2xl"}>
            <div className={"px-6 py-3 font-bold text-2xl bg-zinc-800/90"}>
               {
                   headers()
               }
            </div>
            <div className={"px-6 py-3 text-center"}>
                { context.text }
            </div>
            <div className={"px-6 py-3 flex flex-row gap-3 justify-between"}>
                { context.actions.map((action) => {
                    return <div key={action.text} onClick={() => { action.actionFunction && action.actionFunction(); context.onClose() }} className={"ml-auto bg-zinc-800 hover:bg-zinc-900 cursor-pointer p-3 px-6 w-min rounded"}>{action.text}</div>
                })}
            </div>
        </div>
   )
}

export default function PromptAreaComponent() {

    return (
        <div id={"promptArea"} className={"empty:hidden fixed w-[100vw] h-[100vh]  z-[90] backdrop-blur-[4px] bg-zinc-950/40 flex flex-col justify-center items-center flex-wrap top-0 left-0"}>
        </div>
    );
}
