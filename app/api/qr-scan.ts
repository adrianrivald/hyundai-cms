import apiConfig from "@/config/api";
import type { Meta } from "@/lib/convertPagination";
import { queryClient } from "@/lib/queryClient";
import type { BannerType } from "@/page/content-editor/homepage/_functions/models/banner";
import type {
  AttendQRType,
  Participant,
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
