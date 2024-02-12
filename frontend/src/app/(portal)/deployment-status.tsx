"use client"
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useCallback, useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';

export enum State {
    none,
    created,
    deploying,
    deployed
}

export default function Status ({ id } : { id: number}) {

    const [state, setState] = useState<State>(State.none);
    const [pulse, setPulse] = useState<boolean>(true);

    const orangeColor = "text-orange-500 fill-orange-500 bg-orange-400/10";
    const yellowColor = "text-yellow-600 fill-yellow-600 bg-yellow-500/10";
    const greenColor = "text-green-600 fill-green-600 bg-green-500/10";


    useEffect(() => {
        setPulse(state === State.created || state === State.deploying );
    }, [state])


    const { ref, inView, entry } = useInView({
        root: null
    });

    const poll = () => {
        fetchAPI(`/api/thingsboard-plugin/deployment/${id}/status`, {} ,{
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            }
        }).then((newState) => {
            switch (newState.status) {
                case "deploying":
                    setState(State.deploying);
                    break;
                case "deployed":
                    setState(State.deployed);
                    break;
                case "created":
                    setState(State.created);
                    break;
                default:
                    break;
            }
        });
    };



        useEffect(() => {
            if(inView && state !== State.deployed) {
                setTimeout(poll, state === State.none ? 0 : 250);
            }
        }, [inView, state])

    return state !== State.none ? (
        <span ref={ref}  className={`inline-flex flex-shrink-0 items-center justify-center rounded-md px-2.5 py-1 text-md h-10 gap-0.5 font-medium w-max ${
            state === State.created && orangeColor || 
            state === State.deploying && yellowColor || 
            state === State.deployed && greenColor
        }`}>
            <svg className={"h-[1.5em] w-[1.5em]"} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"  >
              <circle cx="20" cy="20" r="10" fill="inherit" opacity="0.2">
                  {
                      pulse && (
                      <>
                          <animate attributeName="r" values="8;20" dur="1.5s" begin="0s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.5;0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
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
                state === State.deployed && (
                    "Bereit"
                )
            }
        </span>
    ) : (<div ref={ref}  role="status" className="max-w-sm animate-pulse">
        <div className="bg-gray-200 rounded-md dark:bg-gray-700 w-40 h-8 mb-4"></div>
    </div>);
}
