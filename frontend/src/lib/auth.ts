"use client"
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";


const ID_ITEM_NAME = "token";

export class Auth {

    constructor() {
    }


    public onLogin = () => {};
    async getUser() {

        if(!this.isAuth()) {
            throw new Error("not logged in");
        }

        const qsPara =
            {
                populate: '*',
            }
        ;

        const u = (await fetchAPI("/users/me", qsPara, {
            headers: {
                "Authorization": "Bearer " + this.getToken()
            }
        }));
        console.info(u)
        return u;
    }

    isAuth(): boolean {
        try {
            return localStorage.getItem(ID_ITEM_NAME) !== null;
        } catch (e) {
            return false;
        }
    }

    getToken() {
        return this.isAuth() && localStorage.getItem(ID_ITEM_NAME);
    }

    toString() {
        return this.getUser();
    }

    async login(username: string, password: string) {

        try {

            const response = await fetch(getStrapiURL() + "/api/auth/local", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    identifier: username,
                    password: password,
                })
            });

            const raw = await response.json();

            if(raw.jwt) {
                localStorage.setItem(ID_ITEM_NAME, raw.jwt);
                this.onLogin();
            }
        } catch (e) {

        }

    }

    async logout() {
        localStorage.removeItem(ID_ITEM_NAME)
    }


}
