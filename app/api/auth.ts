import apiConfig from "@/config/api";
import type { LoginTypes, PersonTypes } from "@/types/AuthTypes";
import {
	useMutation,
	type MutationObserverOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";

export async function postLogin(
	email: string,
	password: string
): Promise<AxiosResponse<LoginTypes, AxiosError>> {
	return await apiConfig.post("auth/login", {
		email,
		password,
	});
}

export async function getMe(): Promise<AxiosResponse<PersonTypes, AxiosError>> {
	return await apiConfig.get("auth/me");
}

export const useLogin = (
	options?: MutationObserverOptions<
		LoginTypes,
		Error,
		{ email: string; password: string }
	>
) => {
	return useMutation<LoginTypes, Error, { email: string; password: string }>({
		mutationKey: ["user-login"],
		mutationFn: async ({ email, password }) => {
			const response = await postLogin(email, password);

			Cookies.set("token", response?.data?.access_token, {
				expires: response?.data?.expires_in / 86400,
				sameSite: "strict",
			});

			const me = await getMe();

			Cookies.set("info", JSON.stringify(me.data), {
				sameSite: "strict",
				expires: response?.data?.expires_in / 86400,
			});

			return response.data;
		},
		...options,
	});
};
