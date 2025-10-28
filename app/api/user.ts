import apiConfig from "@/config/api";
import type { Meta } from "@/lib/convertPagination";
import { queryClient } from "@/lib/queryClient";
import {
  useMutation,
  type MutationObserverOptions,
  useQuery,
  type QueryObserverOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export type UserType = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  roles: RoleType[];
};

export type RoleType = {
  id: number;
  name: string;
  guard_name: string;
};

export type PostUserType = {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role?: number;
};

export async function postUser(
  data: PostUserType
): Promise<AxiosResponse<UserType, AxiosError>> {
  return await apiConfig.post("admin/users", data);
}

export async function putUser(
  data: PostUserType
): Promise<AxiosResponse<UserType, AxiosError>> {
  return await apiConfig.put(`admin/users/${data.id}`, data);
}

export async function getUser(
  id: string
): Promise<{ data: UserType; meta: Meta }> {
  const response = await apiConfig.get(`admin/users/${id}`);

  return response.data;
}

export async function getUsers(
  search_query?: string
): Promise<{ data: UserType[]; meta: Meta }> {
  const response = await apiConfig.get(
    `admin/users?search_query=${search_query}`
  );
  return response.data;
}

export async function getRoles(
  search_query?: string
): Promise<{ data: RoleType[]; meta: Meta }> {
  const response = await apiConfig.get(
    `admin/roles?search_query=${search_query}`
  );
  return response.data;
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  return await apiConfig.delete(`admin/users/${id}`);
}

export const usePostUser = (
  options?: MutationObserverOptions<UserType, Error, PostUserType>
) => {
  return useMutation<UserType, Error, PostUserType>({
    mutationKey: ["user-post"],
    mutationFn: async (data: PostUserType) => {
      const response = await postUser(data);
      queryClient.removeQueries({
        predicate: (query) =>
          typeof query.queryKey[0] === "string" &&
          query.queryKey[0].startsWith("user-"),
      });

      return response.data;
    },
    ...options,
  });
};

export const useDeleteUser = (
  options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
  return useMutation<{ message: string }, Error, { id: string }>({
    mutationKey: ["user-delete"],
    mutationFn: async ({ id }) => {
      const response = await deleteUser(id);
      queryClient.removeQueries({
        predicate: (query) =>
          typeof query.queryKey[0] === "string" &&
          query.queryKey[0].startsWith("user-"),
      });

      return response;
    },
    ...options,
  });
};

export const usePutUser = (
  options?: MutationObserverOptions<UserType, Error, PostUserType>
) => {
  return useMutation<UserType, Error, PostUserType>({
    mutationKey: ["user-put"],
    mutationFn: async (data: PostUserType) => {
      const response = await putUser(data);
      queryClient.removeQueries({
        predicate: (query) =>
          typeof query.queryKey[0] === "string" &&
          query.queryKey[0].startsWith("user-"),
      });

      return response.data;
    },
    ...options,
  });
};

export const useGetUsers = (
  search_query: string,
  options?: QueryObserverOptions<{
    data: any[] | UserType[] | any;
    meta: Meta;
  }>
) => {
  return useQuery<{ data: UserType[]; meta: Meta }>({
    queryKey: ["user-get-all", search_query],
    queryFn: async () => {
      const response = await getUsers(search_query);
      return response;
    },
    placeholderData: (prev) => prev,
    ...options,
  });
};

export const useGetRoles = (
  search_query: string,
  options?: QueryObserverOptions<{
    data: any[] | RoleType[] | any;
    meta: Meta;
  }>
) => {
  return useQuery<{ data: RoleType[]; meta: Meta }>({
    queryKey: ["role-get-all", search_query],
    queryFn: async () => {
      const response = await getRoles(search_query);
      return response;
    },
    placeholderData: (prev) => prev,
    ...options,
  });
};

export const useGetUser = (
  id: string,
  options?: QueryObserverOptions<{
    data: UserType | any;
    meta: Meta;
  }>
) => {
  return useQuery<{ data: UserType; meta: Meta }>({
    queryKey: ["user-get", id],
    queryFn: async () => {
      const response = await getUser(id);
      return response;
    },
    placeholderData: (prev) => prev,
    ...options,
  });
};
