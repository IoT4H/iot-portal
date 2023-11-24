"use client"
import Spinner from "@iot-portal/frontend/app/common/spinner";
import { createContext, useContext } from "react";

export class LoadingState {


    state = false;

    constructor(state?: boolean) {
        if(state !== undefined) {
            this.SetState(state);
        }
    }

    public SetState(b: boolean) {
        this.state = b;
        console.info("change to ", this.state)
    }

    public isLoading() {
        return this.state;
    }

    public startLoading() {
        this.SetState(true);
    }

    public endLoading() {
        this.SetState(false);
    }
}

export const LoadingContext = createContext(new LoadingState());

export default function PageBlockingSpinner() {

    const loading = useContext(LoadingContext);

    return loading.isLoading() ?
        <div className={"fixed w-full h-full z-[99] bg-zinc-900/80 flex flex-col items-center justify-center"}>
            <Spinner/>
        </div>
     : <></>;
}


