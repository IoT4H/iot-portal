"use client"
import { State } from "@iot-portal/frontend/app/(portal)/deployment-status";
import Step from "@iot-portal/frontend/app/common/setup/step";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { Suspense, useCallback, useEffect, useState } from "react";

export default function ConfigurationSteps({params}: { params: { id: number } }) {

    const ar = new Array(0);
    const [steps, SetSteps] = useState<Array<any>>(ar);
    const [stepsProgress, SetStepsProgress] = useState<Array<any>>(ar);
    const [state, setState] = useState<State>(State.none);



    const poll = () => {
        fetchAPI(`/api/thingsboard-plugin/deployment/${params.id}/status`, {} ,{
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
        if(state !== State.deployed) {
            setTimeout(poll, state === State.none ? 0 : 250);
        }
    }, [state])

    useEffect(() => {
        if(state === State.deployed) {
                fetchAPI(`/api/thingsboard-plugin/deployment/${params.id}/steps`, {},
                    {
                        headers: {
                            Authorization: `Bearer ${Auth.getToken()}`
                        }
                    }).then((stepsResponse) => {
                    SetSteps(Array.from(stepsResponse));
                })
            fetchStepsProgress();
        }
    }, [state]);

    const fetchStepsProgress = useCallback(() => {
        fetchAPI(`/api/thingsboard-plugin/deployment/${params.id}/steps/progress`, {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((response) => {
                SetStepsProgress(response);
            })
    }, [params.id]);

    useEffect(() => {
        const s = Array.isArray(steps) ? steps.map((s: any, i: number , a: any[]) => {
            if (Array.isArray(stepsProgress)) {
                const stp = stepsProgress.find((e: any) => {
                    return e.id == s.id && e.__component == s.__component;
                })
                if (stp && Array.isArray(s.tasks) && Array.isArray(stp.tasks)) {
                    s.tasks = s.tasks.map((task: any) => {
                        task.progress = stp.tasks.find((e: any) => {
                            return e.id === s.id;
                        })?.progress;
                        return task;
                    })
                }
                s.progress = stp?.progress;
            }
            return s;
        }) : new Array(0);
        SetSteps(Array.from(s));
    }, [stepsProgress])


    return (
        <div className={"gap-8 flex flex-col"}>
            <h1>TEST</h1>
            <Suspense>
                {
                    Array.isArray(steps) && steps.map((s, index, a) => {
                        return (<Step key={s.id.toString() + "-" + s.__component} state={s.progress} viewStatus={true} deployment={params.id} data={ Object.assign(s, {index: index + 1 }) } updateState={() => fetchStepsProgress()} locked={index > 0 && (a[index - 1].progress < 100 || a[index - 1].progress === undefined)} />);
                    })
                }
            </Suspense>
        </div>
    );

}
