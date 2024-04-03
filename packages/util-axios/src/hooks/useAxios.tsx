import axios from "axios";
import type {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import _ from "lodash";
import { useUserStore } from "@sampaiogabriel/util-state";

const onRequest =
    (accessToken: string | undefined) =>
        (config: AxiosRequestConfig): AxiosRequestConfig => {
            if (_.isEmpty(accessToken)) return config;

            const newConfig = { ...config } as AxiosRequestConfig;
            newConfig.headers.authorization = `Bearer ${accessToken}`;
            return newConfig;
        };

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
};

interface UseAxiosProps {
    prefixo?: string;
}

function useAxios({ prefixo }: UseAxiosProps): AxiosInstance {
    const token = JSON.parse(sessionStorage.getItem('@auth/token'));

    const api = axios.create({
        baseURL: `https://jsonplaceholder.typicode.com/todos`,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
        paramsSerializer: { indexes: null, dots: true },
    });

    api.interceptors.request.use(onRequest(token?.access_token), onRequestError);
    api.interceptors.response.use(onResponse, onResponseError);

    return api;
}

export default useAxios;
