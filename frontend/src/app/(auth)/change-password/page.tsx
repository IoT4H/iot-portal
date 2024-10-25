"use client"
import Button from "@iot-portal/frontend/app/common/button";
import { FieldSetCheckbox, FieldSetInput, RequiredStar } from "@iot-portal/frontend/app/common/FieldSet";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { Prompt, PromptType } from "@iot-portal/frontend/app/common/prompt";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";


export default function Page() {

    const router = useRouter();
    const searchParams = useSearchParams()

    const token = searchParams.get('code');


    const [error, SetError] = useState<any>(undefined);

    const [password, SetPassword] = useState<string | undefined>(undefined);
    const [newPassword, SetNewPassword] = useState<string | undefined>(undefined);
    const [newPassword2, SetNewPassword2] = useState<string | undefined>(undefined);

    const passwordMatches = useMemo(() => newPassword == newPassword2, [newPassword, newPassword2]);

    if(!token && !Auth.isAuth()) {
        router.push("/login")
    }

    const changePassword = useCallback(() => {

        if(token) {
            LoadingState.startLoading();
            fetchAPI("/api/auth/reset-password", {}, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "code": token,
                    "password": newPassword,
                    "passwordConfirmation": newPassword2
                }),
            }).then(response => {

                if (response.error) {
                    LoadingState.endLoading();
                }

                if (response.jwt) {
                    Auth.setToken(response.jwt);
                    Auth.onUserChange();
                    router.push("/usecase");
                    LoadingState.endLoading();
                }
            });
        } else if (password && newPassword && newPassword2 && passwordMatches) {
            LoadingState.startLoading();
            fetchAPI("/api/auth/change-password", {}, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({
                    "currentPassword": password,
                    "password": newPassword,
                    "passwordConfirmation": newPassword2
                }),
            }).then(response => {

                if (response.error) {
                    LoadingState.endLoading();
                }

                if (response.jwt) {
                    Auth.setToken(response.jwt);
                    Auth.onUserChange();
                    router.push("/usecase");
                    LoadingState.endLoading();
                }
            });
        }
    }, [token, password , newPassword , newPassword2 , passwordMatches]);

    return <div
        className={"relative w-full max-w-screen-lg flex flex-col justify-center items-center flex-wrap top-0 left-0"}>
        <form className="flex-auto max-h-full w-full" onSubmit={(event) => {event.preventDefault();changePassword();}}>
            <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 border-orange-500"}>Passwort vergessen</h2>
            <div className={" flex flex-col gap-y-8 w-full max-w-xl mx-auto"}>
                <p className={"my-4"}>Jetzt die Zurücksetzung Ihres Passwortes anfordern.</p>

                { !token && (
                    <div className={"mt-2"}>
                        <FieldSetInput className={"w-full"} label={"Aktuelles Passwort"} id={"password"} type={"password"} required
                                       autoComplete={"current-password"}
                                       onChange={(e: any) => SetPassword(e.currentTarget.value)}>
                        </FieldSetInput>
                    </div>
                )}

                <div className={"mt-2 flex flex-col gap-3"} >
                    <FieldSetInput className={"w-full"} label={"Neues Passwort"} id={"new-password1"} type={"password"} required
                                   autoComplete={"new-password"} style={{userSelect: 'none'}} onPaste={(e: any) => e.preventDefault()}
                                   onChange={(e: any) => SetNewPassword(e.currentTarget.value)}>
                    </FieldSetInput>
                    <FieldSetInput className={"w-full"} label={"Neues Passwort wiederholen"} id={"new-password2"} type={"password"} required
                                   autoComplete={"new-password"} style={{userSelect: 'none'}} onPaste={(e: any) => e.preventDefault()}
                                   onChange={(e: any) => SetNewPassword2(e.currentTarget.value)}>
                        { !passwordMatches && (<span className={"text-red-600"}>Passwörter stimmen nicht überein.</span>)}
                    </FieldSetInput>
                </div>

            </div>
            <div className={"mx-8 my-10 flex flex-col gap-y-8"}>
                <div className={"mt-4 flex flex-row justify-center "}>
                    <Button type={"submit"} disabled={!(token || password) || !newPassword || !newPassword2 || !passwordMatches }>Ändern</Button>
                </div>
            </div>

            { error?.message != undefined && <Prompt type={PromptType.Warning} title={"Fehler"} text={error?.message} actions={[{text: "Erneut Versuchen", actionFunction: () => {}}]} onClose={() => SetError(undefined)}/> }
        </form>
    </div>;
}
