"use client"
import Button from "@iot-portal/frontend/app/common/button";
import { FieldSetCheckbox, FieldSetInput, RequiredStar } from "@iot-portal/frontend/app/common/FieldSet";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { Prompt, PromptType } from "@iot-portal/frontend/app/common/prompt";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";


export default function Page() {

    const router = useRouter();
    const urlparams = useParams();

    const [email, SetEmail] = useState("");

    const signUp = useCallback(() => {
        if(!!email && email.length > 0) {
            LoadingState.startLoading();
            fetchAPI(`/api/auth/local/register`, {}, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                }),
            }).then((res) => {
                if (res.jwt) {
                    Auth.setToken(res.jwt);
                    router.push(`/usecase`);
                }

                LoadingState.endLoading();
            });
        }
    }, [email]);

    return <div
        className={"relative w-full max-w-screen-lg  py-8 flex flex-col justify-center items-center flex-wrap top-0 left-0"}>
        <form className="flex-auto max-h-full w-full sticky top-0 pl-4" onSubmit={(event) => {event.preventDefault();signUp();}}>
            <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500"}>Passwort vergessen</h2>
            <p className={"mx-2 my-4"}>Jetzt die Zurücksetzung Ihres Passwortes anfordern.</p>
            <div className={"mx-8 flex flex-col gap-y-8 w-full max-w-xl"}>
                <div className={"mt-4"}>
                    <FieldSetInput className={"w-full"} label={"Email"} id={"email"} type={"email"} required autoComplete={"email"}
                                   onChange={(e: any) => SetEmail(e.currentTarget.value)}>
                    </FieldSetInput>
                </div>
            </div>
            <div className={"mx-8 my-10 flex flex-col gap-y-8"}>
                <div className={"mt-4 flex flex-row justify-center "}>
                    <Button disabled={!email} type={"submit"} >Anfordern</Button>
                </div>
            </div>
        </form>
    </div>;
}
