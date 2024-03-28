import { useUserStore } from "@sampaiogabriel/util-state";
import axios from "axios";

const BASE_URL = "";
const URL_REDIRECT = "";
const URL_UPDATE_TOKEN = "";

export default function useAxiosInstanceHook() {
    const { user } = useUserStore();

    const accessToken = user.access_token;
    const refreshToken = user.refresh_token;
    const v3Token = accessToken;

    let globalToken = accessToken;
    let isRefreshing = false;
    let refreshSubscribers = [];

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${globalToken}`,
        },
    });

    function subscribeTokenRefresh(cb) {
        refreshSubscribers.push(cb);
    }

    function onRefreshed(token) {
        refreshSubscribers.map((cb) => cb(token));
        refreshSubscribers = [];
    }

    async function refreshAccessToken() {
        try {
            const response = await axios.get(URL_UPDATE_TOKEN, {
                headers: {
                    "Refresh-Token": refreshToken,
                    Authorization: v3Token,
                },
            });

            globalToken = response.data.access_token;
        } catch (error) {
            const statusCode = [401, 403, 404, 500];
            if (statusCode.includes(error?.response?.status)) {
                window.location.replace(URL_REDIRECT);
            }
        }

        return globalToken;
    }

    axiosInstance.interceptors.request.use(
        (config) => {
            const newConfig = config;

            if (globalToken) {
                newConfig.headers.Authorization = `Bearer ${globalToken}`;
            }

            return newConfig;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const { config, response } = error;
            let status = null;

            if (response?.status) {
                status = response?.status;
            }

            const originalRequest = config;

            if (status === 401) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshAccessToken().then((newToken) => {
                        isRefreshing = false;
                        onRefreshed(newToken);
                    });
                }

                const retryOrigReq = new Promise((resolve) => {
                    subscribeTokenRefresh((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axios(originalRequest));
                    });
                });

                return retryOrigReq;
            }

            return Promise.reject(error);
        }
    );

    return {
        axiosInstance,
    };
}
