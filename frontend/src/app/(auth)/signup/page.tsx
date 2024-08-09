"use client"
import { XMarkIcon } from "@heroicons/react/20/solid";
import Button from "@iot-portal/frontend/app/common/button";
import { FieldSetInput, FieldSetCheckbox, RequiredStar } from "@iot-portal/frontend/app/common/FieldSet";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";


export default function Page() {




    const signUp = useCallback(() => {
        if(
            formValid
        ) {
            fetchAPI(`/auth/local/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });
        }
    }, []);

    const [firstname, SetFirstname] = useState("");
    const [lastname, SetLastname] = useState("");
    const [username, SetUsername] = useState("");
    const [email, SetEmail] = useState("");
    const [email2, SetEmail2] = useState("");
    const [password, SetPassword] = useState("");
    const [password2, SetPassword2] = useState("");

    const [legal, SetLegal] = useState(false);

    const passwordMatch = useMemo( () => password === password2 || password.length === 0 || password2.length === 0, [password, password2] );

    const emailMatch = useMemo( () => email === email2 || email.length === 0 || email2.length === 0, [password, password2] );

    const formValid = useMemo(() => {
        return firstname.length > 0 &&
        lastname.length > 0 &&
        email.length > 0 &&
        password.length > 0 &&
        legal &&
        passwordMatch &&
        emailMatch
    }, [firstname, lastname, email, password, legal, passwordMatch, emailMatch])

    return <div
        className={"relative py-8 flex flex-col justify-center items-center flex-wrap top-0 left-0"}>
        <form className="flex-auto max-h-full sticky top-0 pl-4">
            <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500"}>Registrieren</h2>
            <p className={"mx-2 my-4"}>Registriere dich jetzt und tauche ein in die faszinierende Welt des Internets der
                Dinge (IoT). Mit deinem Konto erhältst du Zugang zu exklusiven Inhalten, Tutorials, Projekten und einer
                engagierten Community von IoT-Enthusiasten. Fülle einfach das untenstehende Formular aus und starte
                deine IoT-Reise mit uns!</p>
            <div className={"mx-8 flex flex-col gap-y-8"}>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetInput label={"Vorname"} id={"firstname"} required value={firstname}
                                   onChange={(e: any) => SetFirstname(e.currentTarget.value)}></FieldSetInput>
                    <FieldSetInput label={"Nachname"} id={"lastname"} required value={lastname}
                                   onChange={(e: any) => SetLastname(e.currentTarget.value)}></FieldSetInput>
                </div>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4 hidden"}>
                    <FieldSetInput label={"Benutzername"} id={"username"} required value={username}
                                   onChange={(e: any) => SetUsername(e.currentTarget.value)}></FieldSetInput>
                </div>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetInput label={"Email"} id={"email"} type={"email"} required value={email}
                                   onChange={(e: any) => SetEmail(e.currentTarget.value)}></FieldSetInput>
                    <FieldSetInput label={"Email wiederholen"} id={"email2"} type={"email"} required value={email2}
                                   onChange={(e: any) => SetEmail2(e.currentTarget.value)}></FieldSetInput>
                </div>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetInput label={"Passwort"} type={"password"} id={"password"} minlength={8} required
                                   value={password} onChange={(e: any) => SetPassword(e.currentTarget.value)}>
                        {!passwordMatch && (
                            <span className={"text-red-600 text-sm m-0.5 font-bold"}>Die Passwörter stimmen nicht überein!</span>)}
                    </FieldSetInput>
                    <FieldSetInput label={"Passwort wiederholen"} type={"password"} id={"password2"} minlength={8}
                                   required value={password2}
                                   onChange={(e: any) => SetPassword2(e.currentTarget.value)}>
                        {!passwordMatch && (
                            <span className={"text-red-600 text-sm m-0.5 font-bold"}>Die Passwörter stimmen nicht überein!</span>)}
                    </FieldSetInput>
                </div>
            </div>
            <div className={"hidden"}>
                <p className={"mx-2 my-4 mt-12"}>Information zur Kontaktaufnahme (optional).</p>
                <div className={"mx-8 flex flex-col gap-y-8"}>
                    <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                        <FieldSetInput label={"Rufnummer"} type={"phone"} id={"phone"}></FieldSetInput>
                    </div>
                    <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                        <FieldSetInput label={"Straße, Hausnr."} type={"text"} id={"address"}
                                       className={'col-span-2'}></FieldSetInput>
                        <FieldSetInput label={"PLZ"} type={"text"} id={"plz"}></FieldSetInput>
                        <FieldSetInput label={"Stadt"} type={"text"} id={"city"}></FieldSetInput>
                    </div>
                </div>
            </div>
            <div className={"mx-8 my-10 flex flex-col gap-y-8"}>
                <p>Mit <RequiredStar/> markierte Felder sind pflicht.</p>
            </div>
            <div className={"mx-8 my-10 flex flex-col gap-y-8"}>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetCheckbox className={'col-span-2'} id={"legal"} onChange={(e: any) => {
                        SetLegal(e.currentTarget.value)
                    }}>Ich habe die <Link href={"/agb"} target={"_blank"}
                                          className={"text-orange-500 font-bold underline underline-offset-[3px]"}>AGB</Link> und <Link
                        href={"/nutzungsbedingungen"} target={"_blank"}
                        className={"text-orange-500 font-bold underline underline-offset-[3px]"}>Nutzungsbedingungen</Link> gelesen
                        und stimme diesen zu.</FieldSetCheckbox>
                </div>
            </div>
            <div className={"mx-8 my-10 flex flex-col gap-y-8"}>
                <div className={"mt-4 flex flex-row justify-center "}>
                    <Button disabled={formValid}>Registrieren</Button>
                </div>
            </div>
        </form>
    </div>;
}
