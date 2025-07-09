"use client";
import Button from "@iot-portal/frontend/app/common/button";
import { FieldSetInput } from "@iot-portal/frontend/app/common/FieldSet";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { Prompt, PromptType } from "@iot-portal/frontend/app/common/prompt";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { useCallback, useState } from "react";

export default function Page() {
    const [error, SetError] = useState<any>(undefined);
    const [email, SetEmail] = useState("");

    const forgotPassword = useCallback(() => {
        if (!!email && email.length > 0) {
            LoadingState.startLoading();
            fetchAPI(
                `/api/auth/forgot-password`,
                {},
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email
                    })
                }
            ).then(() => {
                LoadingState.endLoading();
            });
        }
    }, [email]);

    return (
        <div
            className={
                "relative w-full max-w-screen-lg flex flex-col justify-center items-center flex-wrap top-0 left-0"
            }
        >
            <form
                className="flex-auto max-h-full w-full sticky top-0 pl-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    forgotPassword();
                }}
            >
                <h2
                    className={
                        "dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 border-orange-500"
                    }
                >
                    Passwort vergessen
                </h2>
                <div className={" flex flex-col gap-y-8 w-full max-w-xl px-4 mx-auto"}>
                    <p className={"mt-16"}>Jetzt die Zurücksetzung Ihres Passwortes anfordern.</p>
                    <div className={"mt-4"}>
                        <FieldSetInput
                            className={"w-full"}
                            label={"Email"}
                            id={"email"}
                            type={"email"}
                            required
                            autoComplete={"email"}
                            onChange={(e: any) => SetEmail(e.currentTarget.value)}
                        ></FieldSetInput>
                    </div>
                </div>
                <div className={"mx-8 my-10 flex flex-col gap-y-8"}>
                    <div className={"mt-4 flex flex-row justify-center "}>
                        <Button disabled={!email} type={"submit"}>
                            Anfordern
                        </Button>
                    </div>
                </div>

                {error?.message != undefined && (
                    <Prompt
                        type={PromptType.Warning}
                        title={"Fehler"}
                        text={error?.message}
                        actions={[
                            {
                                text: "Erneut Versuchen",
                                actionFunction: () => {}
                            }
                        ]}
                        onClose={() => SetError(undefined)}
                    />
                )}
            </form>
        </div>
    );
}
