import { Typography } from "@/components/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react/dist/iconify.js";
import StickyFooter from "@/components/layout/sticky-footer";
import StickyHeader from "@/components/layout/sticky-header";
import { useState, useEffect } from "react";
import { useGetParticipantsByDate } from "@/api/qr-scan";
import { format } from "date-fns";

export default function VisitorList() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [paginate, setPaginate] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data } = useGetParticipantsByDate({
    date: today,
    search_query: debouncedSearch,
    paginate,
  });

  const visitors = data?.data?.data ?? [];

  const filteredVisitors = visitors.filter((visitor) =>
    visitor.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div
        className="relative w-full max-w-[768px] flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #153263, #00102B)",
        }}
      >
        <StickyHeader />

        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-6 text-white space-y-6">
              <Typography className="text-xl font-bold text-center">
                Daftar Visitor
              </Typography>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Icon
                    icon="mdi:magnify"
                    width="20"
                    height="20"
                    className="text-white/70"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama Peserta"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1E3A5F] text-white placeholder-white/70 rounded-lg pl-10 pr-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date Display */}
              <div className="flex items-center gap-2">
                <Icon icon="mdi:calendar" width="20" height="20" />
                <Typography className="text-sm">29 February 2024</Typography>
              </div>

              <div className="bg-black rounded-t-lg px-4 py-3 mb-0">
                <div className="grid grid-cols-2 gap-4">
                  <Typography className="text-sm font-bold">
                    Nama Peserta
                  </Typography>
                  <Typography className="text-sm font-bold">
                    Nomor HP
                  </Typography>
                </div>
              </div>

              <div className=" rounded-b-lg overflow-hidden">
                {filteredVisitors.map((visitor, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 ${
                      index !== filteredVisitors.length - 1
                        ? "border-b border-white/10"
                        : ""
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Typography className="text-sm">
                        {visitor.name}
                      </Typography>
                      <Typography className="text-sm">
                        {visitor.phone_number}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        <StickyFooter activeItem="Visitor List" />
      </div>
    </div>
  );
}
