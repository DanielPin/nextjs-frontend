import { getKeycloakInstance } from "@react-keycloak/ssr";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";


const makeHttp = (token?: string): AxiosInstance => {
  if (!process.browser && !token) {
    throw new Error("The access token must be provided");
  }

  const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
  

  http.interceptors.request.use((request) => {
    if (process.browser) {
      return addTokenByKeycloak(request);
    } else {
      addToken(request, token!);
      return request;
    }
  });

  return http;
};

function addTokenByKeycloak(
  request: AxiosRequestConfig
): AxiosRequestConfig | Promise<AxiosRequestConfig> {
  const keycloak = getKeycloakInstance(null as any);
  if (keycloak?.token) {
    addToken(request, keycloak?.token);
    return request;
  }

  return new Promise((resolve, reject) => {
    keycloak.onAuthSuccess = () => {
      addToken(request, keycloak?.token!);
      resolve(request);
    };
    keycloak.onAuthError = () => {
      reject("Unauthenticated");
    };
  });
}

function addToken(request: AxiosRequestConfig, token: string) {
  request.headers["Authorization"] = `Bearer ${token}`;
}

export default makeHttp;
