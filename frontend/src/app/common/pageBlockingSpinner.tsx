"use client"
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import Spinner from "@iot-portal/frontend/app/common/spinner";
import { Auth, User } from "@iot-portal/frontend/lib/auth";
import { createContext, useContext, useEffect, useState } from "react";

export class LoadingState {


    static state = false;

    constructor(state?: boolean) {
        if(state !== undefined) {
            LoadingState.SetState(state);
        }
    }

    static onChange = (state: boolean) => {};

    static SetState(b: boolean) {
        LoadingState.state = b;
        console.info("change to ", this.state)
    }

    static isLoading() {
        return LoadingState.state;
    }

    static startLoading() {
        LoadingState.SetState(true);
        LoadingState.onChange(LoadingState.isLoading());
    }

    static endLoading() {
        LoadingState.SetState(false);
        LoadingState.onChange(LoadingState.isLoading());
    }
}

export const LoadingContext = createContext<boolean>(false);

export default function PageBlockingSpinner() {



    const isLoading = useContext(LoadingContext);

    return (<>
            { isLoading && (
                <div className={"fixed w-full h-full z-[99] bg-zinc-900/80 flex flex-col items-center justify-center"}>
                    <Spinner className={"h-24"}/>
                </div> ) }
    </>);
}


export function LoadingWrapper ({children} : {children: any}) {

    const [loading, SetLoading] = useState<boolean>(false);

    LoadingState.onChange = (state) => {
        SetLoading(state);
    }

    useEffect(() => {
        SetLoading(LoadingState.isLoading())
    }, [])

    return <LoadingContext.Provider value={loading}>
        {children}</LoadingContext.Provider>
}
