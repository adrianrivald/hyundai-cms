import axios, {
	type AxiosInstance,
	type AxiosError,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
	type AxiosStatic,
} from "axios";
import qs from "qs";

const cancelTokenSource = axios.CancelToken.source();

export const apiConfig: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL,
	timeout: 310000,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
	paramsSerializer: (params) =>
		qs.stringify(params, {
			arrayFormat: "comma",
			skipNulls: true,
		}),
});

declare module "axios" {
	interface AxiosDefaults {
		// interceptors?: AxiosInstance["interceptors"];
		interceptors?: {
			request: {
				onFulfilled?: Parameters<
					AxiosInstance["interceptors"]["request"]["use"]
				>[0];
				onRejected?: Parameters<
					AxiosInstance["interceptors"]["request"]["use"]
				>[1];
			};
			response: {
				onFulfilled?: Parameters<
					AxiosInstance["interceptors"]["response"]["use"]
				>[0];
				onRejected?: Parameters<
					AxiosInstance["interceptors"]["response"]["use"]
				>[1];
			};
		};
	}
}

// https://github.com/axios/axios/issues/510
// For create default interceptor for all instance or inherit instance,
// because axios is not supported yet
const _createAxios = (apiConfig as AxiosStatic).create.bind(axios);
(apiConfig as AxiosStatic).create = function create(conf) {
	const instance = _createAxios(conf);
	const defaultIcs = apiConfig.defaults.interceptors;

	const reqInterceptor = defaultIcs?.request ? defaultIcs.request : false;
	const resInterceptor = defaultIcs?.response ? defaultIcs.response : false;

	if (reqInterceptor) {
		instance.interceptors.request.use(
			reqInterceptor.onFulfilled,
			reqInterceptor.onRejected
		);
	}
	if (resInterceptor) {
		instance.interceptors.response.use(
			resInterceptor.onFulfilled,
			resInterceptor.onRejected
		);
	}
	return instance;
};

const requestFulfilled = (config: InternalAxiosRequestConfig) => {
	//TODO:
	//const token = getClientIdData()?.tokenResponse.accessToken
	//config.headers.Authorization = `Bearer ${token}`
	config.cancelToken = cancelTokenSource.token;
	return config;
};

const requestRejected = (error: AxiosError) => Promise.reject(error);

const responseFulfilled = (res: AxiosResponse) => res;
const responseRejected = async (error: AxiosError) => {
	if (error.response?.status === 401 || error.response?.status === 403) {
		localStorage.removeItem(import.meta.env.REACT_APP_CLIENT_ID);
		localStorage.removeItem(import.meta.env.REACT_APP_CLIENT_UT_PORTAL);
		localStorage.removeItem(import.meta.env.REACT_APP_OCP_APIM_KEY);
		window.location.href = "/";
	}
	return Promise.reject(error);
};

apiConfig.defaults.interceptors = {
	request: {
		onFulfilled: requestFulfilled,
		onRejected: requestRejected,
	},
	response: {
		onFulfilled: responseFulfilled,
		onRejected: responseRejected,
	},
};

apiConfig.interceptors.request.use(requestFulfilled, requestRejected);
apiConfig.interceptors.response.use(responseFulfilled, responseRejected);

export default apiConfig;
