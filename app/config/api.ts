import axios, {
	type AxiosInstance,
	type AxiosError,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
	type AxiosStatic,
} from "axios";
import qs from "qs";
import Cookies from "js-cookie";

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

/* ------------------ 🔹 Refresh Queue / Lock ------------------ */
let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

async function handleRefreshToken(): Promise<string | null> {
	if (isRefreshing) {
		// wait until refresh completes
		return new Promise((resolve) => refreshQueue.push(resolve));
	}

	isRefreshing = true;
	try {
		const res = await apiConfig.get("auth/refresh");

		const newToken = res.data.access_token;

		// update cookies
		Cookies.set("token", newToken, {
			//expires: res.data.expires_in / 86400,
			sameSite: "strict",
		});

		// resolve all queued requests
		refreshQueue.forEach((cb) => cb(newToken));
		refreshQueue = [];

		return newToken;
	} catch (err) {
		// refresh failed → cleanup and logout
		Cookies.remove("token");
		Cookies.remove("refresh_token");
		Cookies.remove("info");

		if (window.location.pathname !== "/login") {
			window.location.href = "/login";
		}

		refreshQueue.forEach((cb) => cb(null));
		refreshQueue = [];

		throw err;
	} finally {
		isRefreshing = false;
	}
}

/* ------------------ 🔹 Axios Factory Override ------------------ */
const _createAxios = (apiConfig as AxiosStatic).create.bind(axios);
(apiConfig as AxiosStatic).create = function create(conf) {
	const instance = _createAxios(conf);
	const defaultIcs = apiConfig.defaults.interceptors;

	if (defaultIcs?.request) {
		instance.interceptors.request.use(
			defaultIcs.request.onFulfilled,
			defaultIcs.request.onRejected
		);
	}
	if (defaultIcs?.response) {
		instance.interceptors.response.use(
			defaultIcs.response.onFulfilled,
			defaultIcs.response.onRejected
		);
	}
	return instance;
};

/* ------------------ 🔹 Interceptor Logic ------------------ */
const requestFulfilled = (config: InternalAxiosRequestConfig) => {
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
	const originalRequest = error.config;

	// Case: token expired
	if (
		error.response?.status === 401 &&
		(error.response.data as any)?.message === "Token has expired"
	) {
		try {
			const newToken = await handleRefreshToken();
			if (originalRequest && newToken) {
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return apiConfig.request(originalRequest);
			}
		} catch (refreshError) {
			return Promise.reject(refreshError);
		}
	}

	// Case: invalid/expired refresh or forbidden
	if (error.response?.status === 401 || error.response?.status === 403) {
		Cookies.remove("token");
		Cookies.remove("refresh_token");
		Cookies.remove("info");

		if (window.location.pathname !== "/login") {
			window.location.href = "/login";
		}
	}

	return Promise.reject(error);
};

/* ------------------ 🔹 Attach Defaults ------------------ */
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
