"use client";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import { mapUseCase } from "@iot-portal/frontend/app/common/mappingFunctions";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { Prompt, PromptType } from "@iot-portal/frontend/app/common/prompt";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

export default function Start({ params }: { params: { id: number } }) {
    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();

    const [titleInUse, SetTitleInUse] = useState<boolean>(false);

    const [useCase, SetUseCase] = useState<UseCase>();

    const pathname = usePathname();

    const user = useContext(AuthContext);

    const [correctPathname, setCorrectPathname] = useState<string>();

    const router = useRouter();

    useEffect(() => {
        fetchAPI("/api/use-cases", {
            filters: {
                slug: {
                    $eq: params.id
                }
            }
        }).then((data) => {
            const u = mapUseCase(data.data[0]);
            SetUseCase(u);
            setTitle(u.title);
            setDescription(u.summary[0].children[0].text);
        });
    }, [params.id]);

    useEffect(() => {
        fetchAPI(
          "/api/thingsboard-plugin/deployment/exist",
          {
              search: useCase?.title,
              setupId: useCase?.id
          },
          {
              headers: {
                  Authorization: `Bearer ${Auth.getToken()}`
              }
          }
        ).then((data) => {
            if (data.exists) {
                setTitle(data.suggestions[data.suggestions.length - 1] || title);
                SetTitleInUse(false);
            }
        });
    }, [useCase]);

    useEffect(() => {
        fetchAPI(
          "/api/thingsboard-plugin/deployment/exist",
          {
              search: title ? title.trim() : undefined,
              setupId: useCase?.id
          },
          {
              headers: {
                  Authorization: `Bearer ${Auth.getToken()}`
              }
          }
        ).then((data) => {
            SetTitleInUse(data.exists);
        });
    }, [title]);

    const [toDeployedSetupLink, SettoDeployedSetupLink] = useState("");
    const toDeployedSetup = useRef<HTMLAnchorElement>();
    const hiddenLink = (
        <Link
            href={toDeployedSetupLink}
            replace={true}
            className={"hidden"}
          // @ts-ignore
            ref={toDeployedSetup}
        ></Link>
    );


    const setupStart = () => {
        LoadingState.startLoading();
        setTitle((title || "").trim());
        setDescription((description || "").trim());
        useCase &&
            fetchAPI(
                `/api/thingsboard-plugin/usecase/${useCase.id}/setup/deploy`,
              {
                  title: title,
                  description: description
              },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Auth.getToken()}`
                    }
                }
            ).then((data) => {
                SettoDeployedSetupLink(`/mine/${data.id}/`);
            });
    };

    useEffect(() => {
        setCorrectPathname(pathname);
    }, []);

    useEffect(() => {
        if (toDeployedSetupLink !== "" && toDeployedSetup && toDeployedSetup.current) {
            // @ts-ignore
            toDeployedSetup.current?.click();
        }
    }, [toDeployedSetupLink, toDeployedSetup]);

    return (
        correctPathname === usePathname() && (
            <ModalUI key={pathname}>
                {user ? (
                    <div className={"max-w-3xl w-[75vw]"}>
                        <h1 className={"w-full mr-8 text-3xl font-bold"}>
                            Anwendungsfall einrichten
                        </h1>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setupStart();
                            }}
                        >
                            <label
                                htmlFor={"title"}
                                className={"block text-xl mt-8 flex flex-row items-center gap-1"}
                                title={"Titel um das Setup wiederzuerkennen"}
                            >
                                Titel{" "}
                                <InformationCircleIcon
                                    className={"inline-block align-center h-4 w-4"}
                                ></InformationCircleIcon>
                            </label>
                            <input
                                id={"title"}
                                name="title"
                                className={
                                    "mt-2 bg-stone-800/10 rounded-md border-black/10 border-1 w-full text-white focus:ring-white focus:border-black/10 "
                                }
                                value={title}
                                onChange={(event) => {
                                    setTitle(event.target.value);
                                }}
                                autoFocus
                            />
                            <span className={"h-8 block"}>
                                {titleInUse ? (<span className={"text-red-500 "}> Titel schon in Nutzung</span>) : (
                                  <span className={"text-green-600 "}> Titel ist verfügbar</span>)}
                            </span>
                            <label
                                htmlFor={"description"}
                                className={"block text-xl mt-8 flex flex-row items-center gap-1"}
                                title={
                                    "Diese Beschreibung kann weiteren Aufschluss über Ihren eigenen Nutzen bzw. Vorteil erläutern. z.B. 'Aufzeichnung der Position unserer Bohrer (aus Halle A), welche ständig verlegt werden.'"
                                }
                            >
                                Beschreibung (Optional){" "}
                                <InformationCircleIcon
                                    className={"inline-block align-center h-4 w-4"}
                                ></InformationCircleIcon>
                            </label>
                            <textarea
                                name="description"
                                placeholder={
                                    "Diese Beschreibung kann weiteren Aufschluss über Ihren eigenen Nutzen bzw. Vorteil erläutern. z.B. 'Aufzeichnung der Position unserer Bohrer (aus Halle A), welche ständig verlegt werden.'"
                                }
                                className={
                                    "mt-2 bg-stone-800/10 rounded-md border-black/10 border-1 w-full text-white focus:ring-white focus:border-black/10 h-64 resize-none"
                                }
                                value={description}
                                onChange={(event) => {
                                    setDescription(event.target.value);
                                }}
                            ></textarea>
                            <button
                                className={
                                    `mt-4 w-full text-center rounded-md ml-auto text-white flex-row flex gap-4 justify-center items-center uppercase mx-4 px-4 py-4 ${((title || "").length == 0 || (description || "").length == 0 || titleInUse) ? "bg-gray-500 hover:bg-gray-500 cursor-not-allowed" : "bg-orange-500/80 hover:bg-orange-500 cursor-pointer"}`
                                }
                            >
                                Einrichten
                            </button>
                        </form>
                    </div>
                ) : (
                    <Prompt
                        type={PromptType.Warning}
                        title={"Anmeldung erforderlich"}
                        text={
                            "Um diese Funktion nutzen zu können müssen Sie sich zuerst einloggen."
                        }
                        actions={[
                            {
                                text: "Zurück",
                                actionFunction: () => {
                                    router.back();
                                }
                            },
                            { text: "Login", actionFunction: () => router.push("/login") }
                        ]}
                        onClose={() => {}}
                    />
                )}
                {hiddenLink}
            </ModalUI>
        )
    );
}
