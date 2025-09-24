import { Typography } from "@/components/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react/dist/iconify.js";
import StickyFooter from "@/components/layout/sticky-footer";
import StickyHeader from "@/components/layout/sticky-header";
import { useState } from "react";

export default function VisitorList() {
  const [searchQuery, setSearchQuery] = useState("");

  const visitors = [
    { name: "John Doe", phone: "+2837720608484" },
    { name: "Maria Culhane", phone: "+4448546368358" },
    { name: "Hanna Carder", phone: "+9791802725322" },
    { name: "Corey Passaquindici Arcand", phone: "+6964558702330" },
    { name: "Zaire Dokidis", phone: "+2715308209964" },
    { name: "Leo Dokidis", phone: "+1648807600440" },
    { name: "James Curtis", phone: "+7020413720762" },
    { name: "Roger Westervelt", phone: "+6421123644977" },
    { name: "Cooper Aminoff", phone: "+9666457988681" },
    { name: "Kaiya Lipshutz", phone: "+8435151306125" },
  ];

  const filteredVisitors = visitors.filter((visitor) =>
    visitor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {/* Page Title */}
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

              {/* Visitor List Header */}
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

              {/* Visitor List */}
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
                        {visitor.phone}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Sticky Footer */}
        <StickyFooter activeItem="Visitor List" />
      </div>
    </div>
  );
}
