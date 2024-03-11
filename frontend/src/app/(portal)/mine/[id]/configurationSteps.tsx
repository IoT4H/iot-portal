"use client"
import Step from "@iot-portal/frontend/app/common/setup/step";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useCallback, useEffect, useState } from "react";

export default function ConfigurationSteps({params}: { params: { id: number } }) {

    const [steps, SetSteps] = useState<Array<any>>([]);
    const [stepsProgress, SetStepsProgress] = useState<Array<any>>([]);

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
        SetSteps(steps.map((s: any, i: number , a: any[]) => {
            s.progress = stepsProgress.find((e: any) => {
                return e.id == s.id && e.__component == s.__component
            })?.progress;
            console.warn(s);
            return s;
        }));
    }, [stepsProgress])


    return (
        <div className={"gap-8 flex flex-col"}>
            {
                steps.map((s, index) => {
                    return (<Step key={index} state={s.progress} viewStatus={true} deployment={params.id} data={ Object.assign(s, {index: index + 1 }) } updateState={() => fetchStepsProgress()}/>);
                })
            }
        </div>
    );

}
