import apiConfig from "@/config/api";
import type { Meta } from "@/lib/convertPagination";
import { queryClient } from "@/lib/queryClient";
import type { BannerType } from "@/page/content-editor/homepage/_functions/models/banner";
import type { AttendQRType } from "@/page/qr-scan/scan-visitor/_functions/models/scan-visitor";

import {
  useMutation,
  type MutationObserverOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export async function attendQr(
  data: AttendQRType
): Promise<AxiosResponse<AttendQRType, AxiosError>> {
  return await apiConfig.post(`participant/${data.code}/attend`);
}

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
