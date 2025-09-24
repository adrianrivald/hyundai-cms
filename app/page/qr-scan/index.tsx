import { Typography } from "@/components/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react/dist/iconify.js";
import StickyFooter from "@/components/layout/sticky-footer";
import StickyHeader from "@/components/layout/sticky-header";

export default function QRScan() {
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
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="mdi:calendar" width="20" height="20" />
                <Typography className="text-sm">26/08/2024</Typography>
              </div>

              {/* Check-in Status Card */}
              <div className="bg-[#091E41] rounded-lg p-6 mb-6">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <Icon icon="mdi:account-group" width="24" height="24" />
                  <Typography className="text-md">Peserta Check in</Typography>
                </div>
                <div className="flex justify-center items-baseline gap-2">
                  <Typography className="text-[80px] font-bold text-white">
                    32
                  </Typography>
                  <Typography className="text-lg text-white/70">/38</Typography>
                </div>
              </div>

              {/* Visitor Information Section */}
              <div className="mb-6">
                <div className="bg-black rounded-t-lg px-4 py-3 mb-0">
                  <Typography className="text-sm font-medium">
                    Informasi kunjungan hari ini
                  </Typography>
                </div>
                <div className="bg-black/20 rounded-b-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <Typography className="text-sm text-white/80">
                      Nama Instansi
                    </Typography>
                    <Typography className="text-sm font-medium">
                      SMK Adijaya Ciputat
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-sm text-white/80">
                      Asal
                    </Typography>
                    <Typography className="text-sm font-medium">
                      Ciputat Tangerang
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-sm text-white/80">
                      Nama ketua group
                    </Typography>
                    <Typography className="text-sm font-medium">
                      +6964558702330
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-sm text-white/80">
                      Nomor ketua group
                    </Typography>
                    <Typography className="text-sm font-medium">
                      081321245212
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Total Tour Section */}
              <div className="mb-6">
                <div className="bg-black px-4 py-3 mb-0">
                  <Typography className="text-sm font-medium">
                    Total tour
                  </Typography>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-[#00235E] rounded-lg p-4">
                    <Typography className="text-xs text-white/80 mb-2">
                      Jumlah Peserta Tour
                    </Typography>
                    <Typography className="text-2xl font-bold">38</Typography>
                  </div>
                  <div className="bg-[#00235E] rounded-lg p-4">
                    <Typography className="text-xs text-white/80 mb-2">
                      Presentage
                    </Typography>
                    <Typography className="text-2xl font-bold">87%</Typography>
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
