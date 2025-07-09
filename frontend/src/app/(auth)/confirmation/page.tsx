"use client";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { Prompt, PromptType } from "@iot-portal/frontend/app/common/prompt";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("code");

    const [error, SetError] = useState<any>(undefined);

    if (!token) {
        router.push("/login");
    }

    const changePassword = useCallback(() => {
        if (token) {
            LoadingState.startLoading();
            fetchAPI(
                "/api/auth/email-confirmation",
                {},
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        code: token
                    })
                }
            ).then((response) => {
                if (response.error) {
                    LoadingState.endLoading();
                }

                if (response.jwt) {
                    Auth.setToken(response.jwt);
                    Auth.onUserChange();
                    LoadingState.endLoading();
                }
            });
        }
    }, [token]);

    return (
        <div
            className={
                "relative w-full max-w-screen-lg flex flex-col justify-center items-center flex-wrap top-0 left-0"
            }
        >
            <form
                className="flex-auto max-h-full w-full"
                onSubmit={(event) => {
                    event.preventDefault();
                    changePassword();
                }}
            >
                <h2
                    className={
                        "dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 border-orange-500"
                    }
                >
                    Passwort vergessen
                </h2>
                <div className={" flex flex-col gap-y-8 w-full max-w-xl mx-auto"}>
                    <p className={"my-4"}>Email wurde erfolgreich bestätigt.</p>
                </div>
                <p>
                    <Link href={"/usecase"}> Jetzt Anwendungsfälle anschauen.</Link>
                </p>

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
