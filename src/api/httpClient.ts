import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { message } from "antd";
import { getAccessToken, logout } from "../auth/msalService";

// create Axios instance
const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request Interceptor: Automatically Attach the Latest Access Token Before Each Request
httpClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const nonAuthPaths = ["api/auth/setup"];
            if (nonAuthPaths.some(path => config.url?.startsWith(path))) {
                return config;
            }
            // Obtain the Latest Access Token
            const accessToken = await getAccessToken();

            // Ensure Headers Exist and Add the Authorization Header
            if (accessToken && config.headers) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
            return config;
        } catch (error) {
            message.error("Failed to retrieve access token.");
            return Promise.reject(error);
        }
    },
    error => {
        // Capture Errors in the Request Interceptor
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors in the Response
httpClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                message.error("認証エラーが発生しました。再度ログインしてください。");
                try {
                    await logout();
                } catch (logoutError) {
                    console.error("Failed to log out:", logoutError);
                }
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } else if (error.code === "ECONNABORTED") {
                message.error("リクエストがタイムアウトしました。お手数ですが、もう一度お試しください。");
            }
            const errorMessage = (error.response.data as { message: string }).message || "Unknown error";
            const customError = new Error(errorMessage) as Error & { status?: number };
            customError.status = status;
            return Promise.reject(customError);
        }
        return Promise.reject(new Error("Network Error"));
    }
);

export default httpClient;
