import apiConfig from "@/config/api";
import type { Meta } from "@/lib/convertPagination";
import { queryClient } from "@/lib/queryClient";
import type { BannerType } from "@/page/content-editor/homepage/_functions/models/banner";
import type {
  AttendQRType,
  Participant,
  CalendarDaily,
  ParticipantsList,
} from "@/page/qr-scan/scan-visitor/_functions/models/scan-visitor";

import {
  useMutation,
  useQuery,
  type MutationObserverOptions,
  type QueryObserverOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export async function getParticipant(code: string): Promise<Participant> {
  const response = await apiConfig.get(`admin/participant/${code}`);

  return response.data;
}

export async function attendQr(
  data: AttendQRType
): Promise<AxiosResponse<AttendQRType, AxiosError>> {
  return await apiConfig.post(`admin/participant/${data.code}/attend`);
}

export const useGetParticipant = (
  code: string,
  options?: QueryObserverOptions<Participant>
) => {
  return useQuery<Participant>({
    queryKey: ["participant-get", code],
    queryFn: async () => {
      const response = await getParticipant(code);
      return response;
    },
    placeholderData: (prev) => prev,
    ...options,
  });
};

export const useAttendQR = (
  options?: MutationObserverOptions<AttendQRType, Error, AttendQRType>
) => {
  return useMutation<AttendQRType, Error, AttendQRType>({
    mutationKey: ["attend-qr"],
    mutationFn: async (data: AttendQRType) => {
      const response = await attendQr(data);

      return response.data;
    },
    ...options,
  });
};

export async function getCalendarDaily(date: string): Promise<CalendarDaily> {
  const response = await apiConfig.get(
    `admin/calendar-date-daily?date=${date}`
  );

  return response.data;
}

export const useGetCalendarDaily = (
  date: string,
  options?: QueryObserverOptions<CalendarDaily>
) => {
  return useQuery<CalendarDaily>({
    queryKey: ["calendar-daily-get", date],
    queryFn: async () => {
      const response = await getCalendarDaily(date);
      return response;
    },
    placeholderData: (prev) => prev,
    ...options,
  });
};

interface ParticipantsByDate {
  date: string;
  search_query: string;
  paginate: boolean;
}

export async function getParticipantsByDate({
  date,
  search_query,
  paginate,
}: ParticipantsByDate): Promise<ParticipantsList> {
  const query = new URLSearchParams({
    // date: "2025-09-30", // change back to date
    date,
    ...(search_query && { search_query }),
    ...(paginate && { paginate: String(false) }),
  }).toString();

  const response = await apiConfig.get(`admin/participants-by-date?${query}`);

  return response.data;
}

export const useGetParticipantsByDate = (
  params: ParticipantsByDate,
  options?: QueryObserverOptions<ParticipantsList>
) => {
  return useQuery<ParticipantsList>({
    queryKey: [
      "participants-by-date-get",
      params.date,
      params.search_query,
      params.paginate,
    ],
    queryFn: async () => {
      const response = await getParticipantsByDate(params);
      return response;
    },
    placeholderData: (prev) => prev,
    ...options,
  });
};
