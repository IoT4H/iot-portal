"use client"
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { fetchAPI, getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import { APITool } from "@iot-portal/frontend/lib/APITool";
import { useContext, useEffect, useState } from "react";

export type User = {

    auth: Auth;
    firstname: string;
    middlename: string;
    lastname: string;
    firm: {  name: string };


}

export const useIsAuth = () => {
    const [isAuth, SetIsAuth] = useState(false);

    const user = useContext(AuthContext);


    useEffect(() => {
        SetIsAuth(user !== undefined);
    }, [user])

    return isAuth;
}

export class Auth {

    static ID_ITEM_NAME = "token";

    static onUserChange = () => {};

    static async getUser(): Promise<User | undefined> {

        if(!this.isAuth()) {
            return undefined;
        }

        const qsPara =
            {
                populate: '*',
            }
        ;

        const u = await fetchAPI( "/api/users/me", qsPara, {
            headers: {
                "Authorization": "Bearer " + this.getToken(),
            },
            cache: "force-cache"
        });

        return u && { auth: this, firstname: u.firstname, middlename: u.middlename, lastname: u.lastname, firm: u.firm };
    }

    static isAuth(): boolean {
        try {
            return localStorage.getItem(Auth.ID_ITEM_NAME) !== null;
        } catch (e) {
            return false;
        }
    }

    static getToken() {
        return this.isAuth() && localStorage.getItem(Auth.ID_ITEM_NAME);
    }


    static setToken(token: string) {
        localStorage.setItem(Auth.ID_ITEM_NAME, token);
        Auth.onUserChange();
    }

    static removeToken() {
        localStorage.removeItem(Auth.ID_ITEM_NAME);
    }

    static async login(username: string, password: string) {

        LoadingState.startLoading();
            const response = await fetchAPI( "/api/auth/local", {},{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    identifier: username,
                    password: password,
                })
            });

            if(response.error) {
                LoadingState.endLoading();
                throw new Error(response.error.message);
            }

            if(response.jwt) {
                Auth.setToken(response.jwt);
                Auth.onUserChange();
                LoadingState.endLoading();
            }


    }

     static logout() {
        LoadingState.startLoading();
        Auth.removeToken();
        Auth.onUserChange();
        LoadingState.endLoading();
    }

}
