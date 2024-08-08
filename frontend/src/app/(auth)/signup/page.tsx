"use client"
import { XMarkIcon } from "@heroicons/react/20/solid";
import { FieldSetInput, FieldSetCheckbox } from "@iot-portal/frontend/app/common/FieldSet";
import Link from "next/link";


export default function Page() {
    return <div
        className={"relative py-8 flex flex-col justify-center items-center flex-wrap top-0 left-0"}>
        <div className="flex-auto max-h-full sticky top-0 pl-4">
            <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500"}>Registrieren</h2>
            <p className={"mx-2 my-4"}>Registriere dich jetzt und tauche ein in die faszinierende Welt des Internets der
                Dinge (IoT). Mit deinem Konto erhältst du Zugang zu exklusiven Inhalten, Tutorials, Projekten und einer
                engagierten Community von IoT-Enthusiasten. Fülle einfach das untenstehende Formular aus und starte
                deine IoT-Reise mit uns!</p>
            <div className={"mx-8 flex flex-col gap-y-8"}>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetInput label={"Vorname"} id={"firstname"} required></FieldSetInput>
                    <FieldSetInput label={"Nachname"} id={"lastname"} required></FieldSetInput>
                </div>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetInput label={"Benutzername"} id={"username"} required></FieldSetInput>
                </div>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetInput label={"Email"} id={"email"} required></FieldSetInput>
                    <FieldSetInput label={"Email wiederholen"} id={"email2"} required></FieldSetInput>
                </div>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetInput label={"Passwort"} type={"password"} id={"password"} required></FieldSetInput>
                    <FieldSetInput label={"Passwort wiederholen"} type={"password"} id={"password2"} required></FieldSetInput>
                </div>
            </div>
            <p className={"mx-2 my-4 mt-12"}>Information zur Kontaktaufnahme (optional).</p>
            <div className={"mx-8 flex flex-col gap-y-8"}>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetInput label={"Rufnummer"} type={"phone"} id={"phone"} ></FieldSetInput>
                </div>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetInput label={"Straße, Hausnr."} type={"text"} id={"address"} className={'col-span-2'}></FieldSetInput>
                    <FieldSetInput label={"PLZ"} type={"text"} id={"plz"} ></FieldSetInput>
                    <FieldSetInput label={"Stadt"} type={"text"} id={"city"} ></FieldSetInput>
                </div>
            </div>
            <div className={"mx-8 my-10 flex flex-col gap-y-8"}>
                <div className={"mt-4 grid grid-cols-2 gap-x-8 gap-y-4"}>
                    <FieldSetCheckbox className={'col-span-2'} id={"legal"} >Ich habe die <Link href={"/agb"}
                                                                                  className={"text-orange-500 font-bold underline underline-offset-[3px]"}>AGB</Link> und <Link
                        href={"/nutzungsbedingungen"}
                        className={"text-orange-500 font-bold underline underline-offset-[3px]"}>Nutzungsbedingungen</Link> gelesen
                        und stimme diesen zu.</FieldSetCheckbox>
                </div>
            </div>
            <div className={"mx-8 my-10 flex flex-col gap-y-8"}>
                <div className={"mt-4 flex flex-row justify-center "}>
                    <button className={"cursor-pointer text-center bg-orange-500/80 hover:bg-orange-500 text-white rounded mx-4 px-8 py-4"}>Registrieren</button>
                </div>
            </div>
        </div>
    </div>;
}
