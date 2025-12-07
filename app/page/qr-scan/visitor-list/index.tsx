import { Typography } from "@/components/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react/dist/iconify.js";
import StickyFooter from "@/components/layout/sticky-footer";
import StickyHeader from "@/components/layout/sticky-header";
import { useState, useEffect } from "react";
import { attendQr, useGetParticipantsByDate, addVisitor } from "@/api/qr-scan";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { useDeleteParticipantTourGroup } from "@/api/tour";
import { enqueueSnackbar } from "notistack";
import { useOfflineMode } from "@/hooks/use-offline-mode";
import { offlineStorage } from "@/lib/offline-storage";
import { OfflineIndicator } from "@/components/offline-indicator";

export default function VisitorList() {
  const location = useLocation();
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [paginate, setPaginate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openBypass, setOpenBypass] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<{
    id: string | number;
    name: string;
  } | null>(null);
  const [selectedVisitorId, setSelectedVisitorId] = useState<number | null>(
    null
  );
  const [offlineVisitors, setOfflineVisitors] = useState<any[]>([]);
  const [lastFetchedVisitors, setLastFetchedVisitors] = useState<any[] | null>(
    null
  );
  const { mutate: mutateDelete } = useDeleteParticipantTourGroup();
  const {
    isOnline,
    offlineVisitors: storedOfflineVisitors,
    deleteOfflineVisitor,
  } = useOfflineMode();

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

  // Hydrate last fetched list from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("lastFetchedVisitors");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) setLastFetchedVisitors(parsed);
      }
    } catch (_) {}
  }, []);

  // Cache last fetched online visitors list for offline display
  useEffect(() => {
    const onlineVisitors = data?.data?.data;
    if (Array.isArray(onlineVisitors)) {
      setLastFetchedVisitors(onlineVisitors);
      try {
        localStorage.setItem(
          "lastFetchedVisitors",
          JSON.stringify(onlineVisitors)
        );
      } catch (_) {}
    }
  }, [data]);

  // Maintain offline visitors list for offline mutations/storage, though display uses last fetched
  useEffect(() => {
    if (!isOnline) {
      setOfflineVisitors(storedOfflineVisitors);
    } else {
      setOfflineVisitors([]);
    }
  }, [isOnline, storedOfflineVisitors]);

  // When offline, merge last fetched with any newly added offline visitors (avoid duplicates)
  const offlineNewVisitors = offlineVisitors.filter((v) =>
    String(v.verification_code || "").startsWith("offline_")
  );
  const mergeVisitors = (base: any[], extras: any[]) => {
    const byCode = new Map<string, any>();
    base.forEach((v) =>
      byCode.set(String(v.verification_code ?? v.id ?? Math.random()), v)
    );
    extras.forEach((v) => {
      const key = String(v.verification_code ?? v.id ?? Math.random());
      if (!byCode.has(key)) byCode.set(key, v);
    });
    return Array.from(byCode.values());
  };

  const visitors = isOnline
    ? (data?.data?.data ?? [])
    : mergeVisitors(lastFetchedVisitors ?? [], offlineNewVisitors);

  // When back online, sync offline-added visitors to server
  useEffect(() => {
    const syncOfflineAdds = async () => {
      if (!isOnline) return;
      const pendingAdds = offlineVisitors.filter((v) =>
        String(v.verification_code || "").startsWith("offline_")
      );
      if (pendingAdds.length === 0) return;
      for (const v of pendingAdds) {
        try {
          await addVisitor({
            name: v.name,
            dob: v.dob,
            phone_number: v.phone_number,
            email: v.email,
            sex: v.sex,
            is_special_need: Boolean(v.is_special_need),
            tour_number: v.tour_number,
          });
          await deleteOfflineVisitor(v.id);
        } catch (err: any) {
          enqueueSnackbar(
            `Failed to sync ${v.name}: ${err?.response?.data?.message || err.message || ""}`,
            { variant: "error" }
          );
        }
      }
      enqueueSnackbar("Offline visitors synced", { variant: "success" });
      refetch();
    };
    syncOfflineAdds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

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

  const handleBypass = async (visitorCode: string, visitorName: string) => {
    setSelectedVisitor({ id: visitorCode, name: visitorName });
    setOpenBypass(true);
  };

  const confirmBypass = async () => {
    if (!selectedVisitor) return;

    const { id: visitorCode } = selectedVisitor;

    if (isOnline) {
      try {
        const response = await attendQr({ code: String(visitorCode) });
        if (response.status === 200) {
          enqueueSnackbar("Visitor marked as attended", { variant: "success" });
          refetch();
        }
      } catch (error: any) {
        enqueueSnackbar(
          `Error: ${error.response?.data?.message || "Failed to mark as attended"}`,
          {
            variant: "error",
          }
        );
      }
    } else {
      // Offline mode - update visitor in offline storage
      const offlineVisitor = storedOfflineVisitors.find(
        (v) => v.verification_code === visitorCode
      );
      if (offlineVisitor) {
        await offlineStorage.updateVisitor(offlineVisitor.id, {
          attended_at: new Date().toISOString(),
        });
        // Refresh offline visitors
        const updatedVisitors = await offlineStorage.getVisitors();
        setOfflineVisitors(updatedVisitors);
        enqueueSnackbar("Visitor marked as attended (offline)", {
          variant: "success",
        });
      }
    }

    setOpenBypass(false);
    setSelectedVisitor(null);
  };

  const onOpenDelete = (visitorId: number) => {
    setOpenDelete(true);
    setSelectedVisitorId(visitorId);
  };

  const onDelete = () => {
    if (isOnline) {
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
    } else {
      // Offline mode - delete from offline storage
      const offlineVisitor = storedOfflineVisitors.find(
        (v) => v.id === String(selectedVisitorId)
      );
      if (offlineVisitor) {
        deleteOfflineVisitor(offlineVisitor.id)
          .then(() => {
            setOpenDelete(false);
            enqueueSnackbar("Data has been deleted (offline)", {
              variant: "success",
            });
            // Refresh offline visitors
            offlineStorage.getVisitors().then((updatedVisitors) => {
              setOfflineVisitors(updatedVisitors);
            });
          })
          .catch((err) => {
            enqueueSnackbar(`Error: ${err.message}`, {
              variant: "error",
            });
          });
      }
    }
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
              <div className="flex items-center justify-between">
                <Typography className="text-xl font-bold text-center flex-1">
                  Visitor List
                </Typography>
                {!isOnline && <OfflineIndicator />}
              </div>

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

        <DialogDelete
          open={openBypass}
          onClose={() => {
            setOpenBypass(false);
          }}
          onSubmit={() => {
            confirmBypass();
          }}
          title={`Are you sure you want to mark this user as attended?`}
          subtitle="This action will permanently bypass the selected user and cannot be undone.
"
        />

        <StickyFooter activeItem="Visitor List" />
      </div>
    </div>
  );
}
