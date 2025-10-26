import { Typography } from "@/components/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react/dist/iconify.js";
import StickyFooter from "@/components/layout/sticky-footer";
import StickyHeader from "@/components/layout/sticky-header";
import { useGetCalendarDaily } from "@/api/qr-scan";
import { format } from "date-fns";
import { OfflineIndicator } from "@/components/offline-indicator";
import { useOfflineMode } from "@/hooks/use-offline-mode";

export default function QRScan() {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data } = useGetCalendarDaily(today);
  const { isOnline, offlineVisitors } = useOfflineMode();

  const attended = data?.data.total?.attended ?? 0;
  const participants = data?.data.total?.participants ?? 0;
  const percentage = data?.data?.total?.attended_pct;

  // Use offline data when offline
  const offlineAttended = offlineVisitors.filter((v) => v.attended_at).length;
  const offlineTotal = offlineVisitors.length;
  const offlinePercentage =
    offlineTotal > 0 ? Math.round((offlineAttended / offlineTotal) * 100) : 0;

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div
        className="relative w-full max-w-[768px] flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #153263, #00102B)",
        }}
      >
        {/* Sticky Header */}
        <StickyHeader />

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-6 text-white space-y-6">
              {/* Date Section */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:calendar" width="20" height="20" />
                  <Typography className="text-sm">
                    {format(new Date(), "dd/MM/yyyy")}
                  </Typography>
                </div>
                <OfflineIndicator />
              </div>

              {/* Check-in Status Card */}
              <div className="bg-[#091E41] rounded-lg p-6 mb-6">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <Icon icon="mdi:account-group" width="24" height="24" />
                  <Typography className="text-md">
                    Checked in Participant
                  </Typography>
                </div>
                <div className="flex justify-center items-baseline gap-2">
                  <Typography className="text-[80px] font-bold text-white">
                    {isOnline ? attended : offlineAttended}
                  </Typography>
                  <Typography className="text-lg text-white/70">
                    /{isOnline ? participants : offlineTotal}
                  </Typography>
                </div>
              </div>

              {/* Total Tour Section */}
              <div className="mb-6">
                <div className="bg-black px-4 py-3 mb-0">
                  <Typography className="text-sm font-medium">
                    Total Factory Tour
                  </Typography>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-[#00235E] rounded-lg p-4">
                    <Typography className="text-xs text-white/80 mb-2">
                      Total Visitor
                    </Typography>
                    <Typography className="text-2xl font-bold">
                      {isOnline ? participants : offlineTotal}
                    </Typography>
                  </div>
                  <div className="bg-[#00235E] rounded-lg p-4">
                    <Typography className="text-xs text-white/80 mb-2">
                      Percentage
                    </Typography>
                    <Typography className="text-2xl font-bold">
                      {isOnline ? percentage : offlinePercentage}%
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Sticky Footer */}
        <StickyFooter activeItem="Home" />
      </div>
    </div>
  );
}
