import { PublicClientApplication } from "@azure/msal-browser";

import { apiTokenScopes } from "./authconfig";

let msalInstance: PublicClientApplication | null = null;

export const setMsalInstance = (instance: PublicClientApplication) => {
    msalInstance = instance;
};

export const getAccessToken = async (): Promise<string | null> => {
    if (!msalInstance) {
        throw new Error("MSAL instance not set. Please set it using setMsalInstance.");
    }
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
        return null;
    }
    const account = accounts[0];
    try {
        const response = await msalInstance.acquireTokenSilent({
            scopes: apiTokenScopes,
            account: account
        });
        return response.accessToken;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    if (!msalInstance) {
        throw new Error("MSAL instance not set. Please set it using setMsalInstance.");
    }
    // await msalInstance.logoutPopup();
    localStorage.clear();
    sessionStorage.clear();
};
