import axios, {
	type AxiosInstance,
	type AxiosError,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
	type AxiosStatic,
} from "axios";
import qs from "qs";
import Cookies from "js-cookie"; // 👈 import js-cookie

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

// --- Make sure every new instance inherits the default interceptors
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

// --- Interceptor logic
const requestFulfilled = (config: InternalAxiosRequestConfig) => {
	// 👇 Grab token from cookie if available
	const token = Cookies.get("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	config.cancelToken = cancelTokenSource.token;
	return config;
};

const requestRejected = (error: AxiosError) => Promise.reject(error);

const responseFulfilled = (res: AxiosResponse) => res;

const responseRejected = async (error: AxiosError) => {
	if (error.response?.status === 401 || error.response?.status === 403) {
		// Clean up cookies & local storage
		Cookies.remove("token");
		Cookies.remove("info");

		if (window.location.pathname !== "/login") {
			window.location.href = "/login";
		}
	}
	return Promise.reject(error);
};

// --- Attach defaults
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
