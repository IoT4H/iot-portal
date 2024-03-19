"use client"
import Step from "@iot-portal/frontend/app/common/setup/step";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useCallback, useEffect, useState } from "react";

export default function ConfigurationSteps({params}: { params: { id: number } }) {

    const [steps, SetSteps] = useState<Array<any>>(Array<any>(0));
    const [stepsProgress, SetStepsProgress] = useState<Array<any>>(Array<any>(0));

    useEffect(() => {

        fetchAPI(`/api/thingsboard-plugin/deployment/${params.id}/steps`, {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((stepsResponse) => {
            SetSteps(stepsResponse);
        })

        fetchStepsProgress();
    }, []);


    useEffect(() => {
        console.warn(steps);
    },[steps])

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
        const s = steps.map((s: any, i: number , a: any[]) => {
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
        });
        SetSteps(s);
    }, [stepsProgress])


    return (
        <div className={"gap-8 flex flex-col"}>
            {
                Array.isArray(steps) && steps.map((s, index, a) => {
                    return (<Step key={s.id.toString() + "-" + s.__component} state={s.progress} viewStatus={true} deployment={params.id} data={ Object.assign(s, {index: index + 1 }) } updateState={() => fetchStepsProgress()} locked={index > 0 && (a[index - 1].progress < 100 || a[index - 1].progress === undefined)} />);
                })
            }
        </div>
    );

}
