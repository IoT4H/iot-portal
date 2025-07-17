"use client";
import { pollStatus, State } from "@iot-portal/frontend/app/(portal)/deployment-status";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import Step from "@iot-portal/frontend/app/common/setup/step";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ConfigurationSteps({ params }: { params: { id: number } }) {
    const ar = new Array(0);
    const [steps, SetSteps] = useState<Array<any>>(ar);
    const [fusionSteps, SetFusionSteps] = useState<Array<any>>(ar);
    const [stepsProgress, SetStepsProgress] = useState<Array<any>>(ar);
    const [state, setState] = useState<State>(State.none);
    const router = useRouter();

    const poll = () => {
        fetchAPI(
            `/api/thingsboard-plugin/deployment/${params.id}/status`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }
        )
            .then((newState) => {
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
            })
            .finally(() => {
                if (state !== State.deployed) {
                    setTimeout(poll, state === State.none ? 0 : 250);
                }
            });
    };

    useEffect(() => {
        if (state === State.deployed) {
            fetchAPI(
                `/api/thingsboard-plugin/deployment/${params.id}/steps`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Auth.getToken()}`
                    }
                }
            ).then((stepsResponse) => {
                SetSteps(Array.from(stepsResponse));
            });

            fetchStepsProgress();
        }
    }, [state]);

    useEffect(() => {
        pollStatus(params.id, setState);
    }, [params.id]);

    const getProgress = (step: { __component: string; id: number }) => {
        return (
            Array.isArray(stepsProgress) &&
            stepsProgress.find((e: any) => {
                return e.id == step.id && e.__component == step.__component;
            })
        );
    };

    const fetchStepsProgress = useCallback(() => {
        LoadingState.startLoading();

        fetchAPI(
            `/api/thingsboard-plugin/deployment/${params.id}/steps/progress`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }
        ).then((response) => {
            SetStepsProgress(response);
            LoadingState.endLoading();
        });

        fetchAPI(
            `/api/thingsboard-plugin/deployment/${params.id}/steps/progressComplete`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }
        ).then((response) => {
            if (response.complete) {
                LoadingState.endLoading();
                router.push(`/mine/${params.id}/dashboards`);
            }
        });
    }, [params.id]);

    useEffect(() => {
        const s = Array.isArray(steps)
            ? steps.map((s: any, i: number, a: any[]) => {
                  if (Array.isArray(stepsProgress)) {
                      const stp = stepsProgress.find((e: any) => {
                          return e.id == s.id && e.__component == s.__component;
                      });
                      if (stp && Array.isArray(s.tasks) && Array.isArray(stp.tasks)) {
                          s.tasks = s.tasks.map((task: any) => {
                              task.progress = stp.tasks.find((e: any) => {
                                  return e.id === s.id;
                              })?.progress;
                              return task;
                          });
                      }
                      s.progress = stp?.progress;
                      s.flash = stp?.flash;
                      s.setup = stp?.setup;
                  }
                  return s;
              })
            : new Array(0);
        SetFusionSteps(Array.from(s));
    }, [steps, stepsProgress]);

    if (Array.isArray(fusionSteps)) {
        return (
            <div className={"gap-8 flex flex-col px-3"}>
                <h1 className={"text-2xl font-bold"}>Einrichtung: </h1>
                <p className={"px-3"}>
                    Dies sind die erste Schritte, um diesen UseCase einzurichten. <br />
                    <br />
                    Bei Fehlern oder Problemen wenden Sie sich bitte an das Team von IoT4H.
                </p>
                {Array.isArray(fusionSteps) &&
                    fusionSteps.map((s, index, a) => {

                        return (
                            <Step
                                key={s.id.toString() + "-" + s.__component}
                                state={getProgress(s)}
                                viewStatus={true}
                                deployment={params.id}
                                data={Object.assign(s, { index: index + 1 })}
                                updateState={() => fetchStepsProgress()}
                                locked={
                                    index > 0 &&
                                    (a[index - 1].progress < 100 ||
                                        a[index - 1].progress === undefined)
                                }
                            />
                        );
                    })}
            </div>
        );
    }
    return null;
}
