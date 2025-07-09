"use client";
import Button from "@iot-portal/frontend/app/common/button";
import { FieldSetInput } from "@iot-portal/frontend/app/common/FieldSet";
import { Auth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { useCallback, useMemo, useState } from "react";

export default function Page() {
    const [loginError, SetLoginError] = useState<any>("");

    const router = useRouter();
    const urlparams = useParams();

    const [email, SetEmail] = useState("");
    const [password, SetPassword] = useState("");

    const formValid = useMemo(() => {
        return email.length > 0 && password.length > 0;
    }, [email, password]);

    const login = useCallback(() => {
        if (formValid) {
            Auth.login(email, password)
                .then(() => {
                    router.push(`${urlparams.return_url || "/usecase"}`);
                })
                .catch((error: string) => {
                    SetLoginError(error);
                });
        }
    }, [urlparams, formValid]);

    return (
        <div
            className={
                "relative w-full my-8 max-w-screen-lg flex flex-col justify-center items-center flex-wrap top-0 left-0"
            }
        >
            <form
                className="flex-auto max-h-full sticky top-0"
                onSubmit={(event) => {
                    event.preventDefault();
                    login();
                }}
            >
                <h2
                    className={
                        "dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 px-2 pb-1 border-orange-500"
                    }
                >
                    Login
                </h2>
                <div className="my-6 w-full">
                    <div className={"mx-auto w-96  flex flex-col gap-y-8"}>
                        <div className={"mt-4 flex flex-col gap-8"}>
                            <FieldSetInput
                                label={"Email"}
                                id={"email"}
                                type={"email"}
                                autoComplete={"email"}
                                onChange={(e: any) => SetEmail(e.currentTarget.value)}
                            ></FieldSetInput>
                            <FieldSetInput
                                label={"Passwort"}
                                id={"password"}
                                type={"password"}
                                autoComplete={"current-password"}
                                onChange={(e: any) => SetPassword(e.currentTarget.value)}
                            >
                                <div className="absolute top-0 right-0 text-base leading-7 ">
                                    <Link
                                        href={"/forgot-password"}
                                        className="font-semibold text-orange-400 hover:text-orange-500"
                                    >
                                        Passwort vergessen?
                                    </Link>
                                </div>
                                <span className={"text-red-600"}>{loginError}</span>
                            </FieldSetInput>

                            <Button type="submit" className={"w-full"}>
                                Einloggen
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Noch kein Account?{" "}
                    <Link
                        href={"/signup"}
                        className="font-semibold leading-6 text-orange-400 hover:text-orange-500"
                    >
                        Jetzt registrieren
                    </Link>
                </p>
            </form>
        </div>
    );
}
