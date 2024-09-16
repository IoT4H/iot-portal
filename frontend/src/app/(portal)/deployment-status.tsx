"use client"
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useCallback, useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import internal from "stream";

export enum State {
    none,
    created,
    deploying,
    deployed,
    failed,
    updating
}

export const pollStatus  = (id: number, setState: Function) => {
    let r = new Promise<boolean>((resolve, reject) => {
        fetchAPI(`/api/thingsboard-plugin/deployment/${id}/status`, {}, {
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            }
        }).then((newState) => {
            switch (newState.status) {
                case "failed":
                    setState(State.failed);
                    resolve(false);
                    break;
                case "deployed":
                    setState(State.deployed);
                    resolve(false);
                    break;
                case "updating":
                    setState(State.updating);
                    break;
                case "deploying":
                    setState(State.deploying);
                    break;
                case "created":
                    setState(State.created);
                    break;
                default:
                    break;
            }

            resolve(true);
        });
    });

    r.then( async (r) => {
        if(r) {
            setTimeout(() => pollStatus(id, setState), 250);
        }
    })
    return r;

};

export default function Status ({ id } : { id: number}) {

    const [state, setState] = useState<State>(State.none);
    const [pulse, setPulse] = useState<boolean>(true);
    const [pollingStarted, SetPollingStarted] = useState<boolean>(false)

    const orangeColor = "text-orange-500 fill-orange-500 bg-orange-400/20";
    const yellowColor = "text-yellow-600 fill-yellow-600 bg-yellow-500/20";
    const greenColor = "text-green-600 fill-green-600 bg-green-500/20";
    const redColor = "text-red-600 fill-red-600 bg-red-500/20";


    useEffect(() => {
        setPulse([State.created, State.deploying, State.updating].includes(state));
    }, [state])


    const { ref, inView, entry } = useInView({
        root: null
    });

    useEffect(() => {
        if(inView && ![State.deployed, State.failed].includes(state) && !pollingStarted) {
            SetPollingStarted(true);
            pollStatus(id, setState);
        }
    }, [inView, state])

    return state !== State.none ? (
        <span ref={ref}  className={`inline-flex flex-shrink-0 items-center justify-center rounded-md px-2.5 py-1 text-md h-10 gap-0.5 font-medium w-max ${
            state === State.created && orangeColor || 
            state === State.deploying && yellowColor ||
            state === State.updating && yellowColor ||
            state === State.deployed && greenColor||
            state === State.failed && redColor
        }`}>
            <svg className={"h-[1.5em] aspect-square"} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"  >
              <circle cx="20" cy="20" r="10" fill="inherit" opacity="0.2">
                  {
                      pulse && (
                      <>
                          <animate attributeName="r" values="8;22" dur="1s" begin="0s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.75;0" dur="1s" begin="0s" repeatCount="indefinite"/>
                      </>
                      )
                  }
              </circle>
              <circle cx="20" cy="20" fill="inherit" r="10"/>
            </svg>
            {
                state === State.created && (
                    "Angefordert"
                ) ||
                state === State.deploying && (
                    "in Bearbeitung"
                ) ||
                state === State.updating && (
                    "Aktualisierung"
                ) ||
                state === State.deployed && (
                    "Bereit"
                ) ||
                state === State.failed && (
                    "Fehlgeschlagen"
                )
            }
        </span>
    ) : (<div ref={ref}  role="status" className="max-w-sm animate-pulse">
        <div className="bg-gray-200 rounded-md dark:bg-gray-700 w-40 h-8 mb-4"></div>
    </div>);
}
