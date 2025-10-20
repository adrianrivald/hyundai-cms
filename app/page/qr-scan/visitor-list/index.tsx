import { Typography } from "@/components/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react/dist/iconify.js";
import StickyFooter from "@/components/layout/sticky-footer";
import StickyHeader from "@/components/layout/sticky-header";
import { useState, useEffect } from "react";
import { attendQr, useGetParticipantsByDate } from "@/api/qr-scan";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { useDeleteParticipantTourGroup } from "@/api/tour";
import { enqueueSnackbar } from "notistack";

export default function VisitorList() {
  const location = useLocation();
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [paginate, setPaginate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedVisitorId, setSelectedVisitorId] = useState<number | null>(
    null
  );
  const { mutate: mutateDelete } = useDeleteParticipantTourGroup();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, refetch } = useGetParticipantsByDate({
    date: today,
    search_query: debouncedSearch,
    paginate,
  });

  const visitors = data?.data?.data ?? [];

  const filteredVisitors = visitors.filter((visitor) =>
    visitor.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  useEffect(() => {
    if (location.state?.updated) {
      refetch();
      // clear the state so it doesn't refetch again if the user navigates back
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refetch]);

  const handleBypass = async (visitorCode: string, attendedAt: string) => {
    if (attendedAt === null) {
      await attendQr({ code: visitorCode }).then((response) => {
        if (response.status === 200) {
          refetch();
        }
      });
    }
  };

  const onOpenDelete = (visitorId: number) => {
    setOpenDelete(true);
    setSelectedVisitorId(visitorId);
  };

  const onDelete = () => {
    mutateDelete(
      { id: String(selectedVisitorId) || "" },
      {
        onSuccess: () => {
          setOpenDelete(false);
          enqueueSnackbar("Data has been deleted", {
            variant: "success",
          });
          refetch();
        },
        onError: (err: any) => {
          enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
            variant: "error",
          });
        },
      }
    );
  };

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div
        className="relative w-full max-w-[768px] flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #153263, #00102B)",
        }}
      >
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-6 text-white space-y-6">
              <Typography className="text-xl font-bold text-center">
                Visitor List
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
                  placeholder="Search Visitor's Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1E3A5F] text-white placeholder-white/70 rounded-lg pl-10 pr-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date Display */}
              <div className="flex items-center gap-2">
                <Icon icon="mdi:calendar" width="20" height="20" />
                <Typography className="text-sm">
                  {" "}
                  {format(new Date(), "dd/MM/yyyy")}
                </Typography>
              </div>

              <div className="bg-black rounded-t-lg px-4 py-3 mb-0">
                <div className="grid grid-cols-4 gap-4">
                  <Typography className="text-sm font-bold">
                    Visitor Name (Group Name)
                  </Typography>
                  <Typography className="text-sm font-bold">
                    Telephone Number
                  </Typography>
                  <Typography className="text-sm font-bold">
                    Bypass Action
                  </Typography>
                  <Typography className="text-sm font-bold">Action</Typography>
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
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <Typography className="text-sm">
                        {visitor.name} {`(${visitor.tour?.name})`}
                      </Typography>
                      <Typography className="text-sm">
                        {visitor.phone_number}
                      </Typography>
                      <Button
                        onClick={() =>
                          handleBypass(
                            visitor.verification_code,
                            visitor.attended_at
                          )
                        }
                        className={`${visitor.attended_at !== null ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {visitor.attended_at !== null ? "Attended" : "Bypass"}
                      </Button>
                      <div className="flex gap-2">
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/qr-scan/visitor-list/update/${visitor.verification_code}`
                            )
                          }
                        >
                          <Icon
                            icon="basil:edit-outline"
                            width="24"
                            height="24"
                            color="#FFF"
                          />
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => onOpenDelete(visitor?.id)}
                        >
                          <Icon
                            icon="mage:trash"
                            width="24"
                            height="24"
                            color="#FF3B30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
        <DialogDelete
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
          }}
          onSubmit={() => {
            onDelete();
          }}
        />
        <StickyFooter activeItem="Visitor List" />
      </div>
    </div>
  );
}
