import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";


const ID_ITEM_NAME = "token";

export class Auth {

    constructor() {
    }

    async getUser() {

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
        return localStorage.getItem(ID_ITEM_NAME) !== null;
    }

    getToken() {
        return this.isAuth() && localStorage.getItem(ID_ITEM_NAME);
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
            }
        } catch (e) {

        }

    }

    async logout() {
        localStorage.removeItem(ID_ITEM_NAME)
    }


}
