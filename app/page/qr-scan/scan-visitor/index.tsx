import { Typography } from "@/components/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react/dist/iconify.js";
import StickyFooter from "@/components/layout/sticky-footer";
import StickyHeader from "@/components/layout/sticky-header";
import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { attendQr, getParticipant } from "@/api/qr-scan";
import { toast } from "sonner";
import type { Participant } from "./_functions/models/scan-visitor";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { useOfflineMode } from "@/hooks/use-offline-mode";
import { offlineStorage } from "@/lib/offline-storage";
import { OfflineIndicator } from "@/components/offline-indicator";

export default function ScanVisitor() {
  const navigate = useNavigate();
  const [isScanned, setIsScanned] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scannedData, setScannedData] = useState<Participant["data"]>();
  const [code, setCode] = useState<string>("");
  const { isOnline, addOfflineVisitor } = useOfflineMode();

  const footerItems = [
    { icon: "formkit:people", label: "Visitor List" },
    { icon: "dinkie-icons:scan", label: "Scan Visitor" },
    { icon: "mdi:register-outline", label: "New Regs" },
    { icon: "mingcute:settings-2-line", label: "Settings" },
  ];

  const handleScan = async (detectedCodes: any[]) => {
    if (!detectedCodes || detectedCodes.length === 0) return;

    const result = detectedCodes[0].rawValue;

    try {
      if (isOnline) {
        const res = await getParticipant(result);
        setCode(result);
        setScannedData(res?.data);
        setIsScanned(true);
      } else {
        // Offline mode - try to find visitor in offline storage
        const offlineVisitors = await offlineStorage.getVisitors();
        const offlineVisitor = offlineVisitors.find(
          (v) => v.verification_code === result
        );

        if (offlineVisitor) {
          setCode(result);
          setScannedData({
            name: offlineVisitor.name,
            phone_number: offlineVisitor.phone_number,
            email: offlineVisitor.email,
            sex: offlineVisitor.sex,
            tour: { name: offlineVisitor.tour_number },
          });
          setIsScanned(true);
        } else {
          enqueueSnackbar("Visitor not found in offline storage", {
            variant: "error",
          });
        }
      }
    } catch (error: any) {
      enqueueSnackbar(
        `Error: ${error?.response?.data?.message ?? "Failed to scan"}`,
        { variant: "error" }
      );
    }
  };

  const handleError = (error: unknown) => {
    console.error("QR Scanner error:", error);
  };

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleManualScan = async (e: any) => {
    e.preventDefault();

    try {
      if (isOnline) {
        const res = await getParticipant(code);
        setScannedData(res.data);
        setIsScanned(true);
      } else {
        // Offline mode - try to find visitor in offline storage
        const offlineVisitors = await offlineStorage.getVisitors();
        const offlineVisitor = offlineVisitors.find(
          (v) => v.verification_code === code
        );

        if (offlineVisitor) {
          setScannedData({
            name: offlineVisitor.name,
            phone_number: offlineVisitor.phone_number,
            email: offlineVisitor.email,
            sex: offlineVisitor.sex,
            tour: { name: offlineVisitor.tour_number },
          });
          setIsScanned(true);
        } else {
          enqueueSnackbar("Visitor not found in offline storage", {
            variant: "error",
          });
        }
      }
    } catch (error: any) {
      enqueueSnackbar(
        `Error: ${error?.response?.data?.message ?? "Failed to scan"}`,
        {
          variant: "error",
        }
      );
    }
  };

  const handleAddVisitor = async () => {
    try {
      if (isOnline) {
        const res = await attendQr({ code });
        setIsScanned(false);
        setScannedData(undefined);
        enqueueSnackbar(`Participant has been added`, {
          variant: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Offline mode - mark visitor as attended in offline storage
        const offlineVisitors = await offlineStorage.getVisitors();
        const offlineVisitor = offlineVisitors.find(
          (v) => v.verification_code === code
        );

        if (offlineVisitor) {
          await offlineStorage.updateVisitor(offlineVisitor.id, {
            attended_at: new Date().toISOString(),
          });

          setIsScanned(false);
          setScannedData(undefined);
          enqueueSnackbar(`Participant marked as attended (offline)`, {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Visitor not found in offline storage", {
            variant: "error",
          });
        }
      }
    } catch (error: any) {
      enqueueSnackbar(
        `Error: ${error?.response?.data?.message ?? "Failed to add participant"}`,
        {
          variant: "error",
        }
      );
    }
  };

  const handleResetScanner = () => {
    setIsScanned(false);
    setScannedData(undefined);
  };

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div
        className="relative w-full max-w-[768px] flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #153263, #00102B)",
        }}
      >
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Page Title */}
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="w-1/3 flex items-center">
              {!isOnline && <OfflineIndicator />}
            </div>
            <div className="w-1/3 flex justify-center items-center">
              <Typography className="text-xl font-bold text-white">
                Scan Visitor
              </Typography>
            </div>
            <div className="w-1/3 flex justify-end items-center">
              <button
                onClick={() => navigate("/qr-scan/scan-visitor/add")}
                className="cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Icon
                  icon="mdi:account-plus-outline"
                  width="24"
                  height="24"
                  className="text-white"
                />
              </button>
            </div>
          </div>

          {/* QR Scanner Area */}
          <div className="flex-1 relative">
            {!isScanned ? (
              <>
                {/* Scanner Interface */}
                <div className="h-full bg-black/50 flex flex-col items-center justify-center px-6">
                  {/* QR Scanner */}
                  <div className="w-full h-3/5 bg-black rounded-lg mb-6 overflow-hidden">
                    <Scanner
                      onScan={handleScan}
                      onError={handleError}
                      styles={{
                        container: {
                          width: "100%",
                          height: "100%",
                        },
                        video: {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        },
                      }}
                      // allowMultiple
                      constraints={{
                        facingMode: "environment", // Use back camera
                      }}
                    />
                  </div>

                  {/* Flashlight Toggle */}
                  <button
                    onClick={() => setFlashlightOn(!flashlightOn)}
                    className="w-12 h-12 rounded-full border-2 border-white bg-transparent flex items-center justify-center mb-6"
                  >
                    <Icon
                      icon="mdi:flashlight"
                      width="24"
                      height="24"
                      className={`text-white ${flashlightOn ? "opacity-100" : "opacity-50"}`}
                    />
                  </button>

                  {/* Or Separator */}
                  <div className="flex items-center w-full mb-6">
                    <div className="flex-1 h-px bg-white/20"></div>
                    <Typography className="px-4 text-white/70 text-sm">
                      Or
                    </Typography>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>

                  {/* Insert Code Button */}
                  <form
                    style={{
                      width: "100%",
                    }}
                    onSubmit={handleManualScan}
                  >
                    {" "}
                    <input
                      type="text"
                      onChange={handleChangeCode}
                      // onKeyDown={handleKeyDown}
                      className="focus:outline-none text-center w-full bg-[#1E3A5F] text-white py-3 px-6 rounded-lg font-medium"
                      placeholder="Insert Code"
                    />
                    <input type="submit" hidden />
                  </form>
                </div>
              </>
            ) : (
              <>
                {/* Scanner Interface with Blur */}
                <div className="h-full bg-black/50 flex flex-col items-center justify-center px-6">
                  <div className="w-full h-3/5 bg-black rounded-lg mb-6 overflow-hidden blur-sm">
                    <Scanner
                      onScan={handleScan}
                      onError={handleError}
                      styles={{
                        container: {
                          width: "100%",
                          height: "100%",
                        },
                        video: {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        },
                      }}
                      // allowMultiple
                      constraints={{
                        facingMode: "environment",
                      }}
                    />
                  </div>

                  {/* Flashlight Toggle */}
                  <button
                    onClick={() => setFlashlightOn(!flashlightOn)}
                    className="w-12 h-12 rounded-full border-2 border-white bg-transparent flex items-center justify-center mb-6 blur-sm"
                  >
                    <Icon
                      icon="mdi:flashlight"
                      width="24"
                      height="24"
                      className={`text-white ${flashlightOn ? "opacity-100" : "opacity-50"}`}
                    />
                  </button>

                  {/* Or Separator */}
                  <div className="flex items-center w-full mb-6 blur-sm">
                    <div className="flex-1 h-px bg-white/20"></div>
                    <Typography className="px-4 text-white/70 text-sm">
                      Or
                    </Typography>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>

                  {/* <div className="w-full"> */}
                  <form
                    style={{
                      width: "100%",
                    }}
                    onSubmit={handleManualScan}
                  >
                    <input
                      type="text"
                      onChange={handleChangeCode}
                      // onKeyDown={handleKeyDown}
                      className="focus:outline-none text-center w-full bg-[#1E3A5F] text-white py-3 px-6 rounded-lg font-medium"
                      placeholder="Insert Code"
                    />
                    <input type="submit" hidden />
                  </form>
                  {/* </div> */}
                </div>

                {/* Visitor Detail Card */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-[#002B74] to-[#00102B] rounded-t-2xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <Typography className="text-lg font-bold text-white">
                      Detail Visitor
                    </Typography>
                    <button
                      onClick={handleResetScanner}
                      className="text-white/70 hover:text-white"
                    >
                      <Icon icon="mdi:close" width="20" height="20" />
                    </button>
                  </div>

                  <div className="w-full h-px bg-white/20 mb-4"></div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <Typography className="text-sm font-medium text-white">
                          {scannedData?.name}
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-sm font-medium text-white">
                          {scannedData?.phone_number}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <Typography className="text-sm font-medium text-white">
                          {scannedData?.sex === "male"
                            ? "Laki-laki"
                            : "Perempuan"}
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-sm font-medium text-white">
                          {scannedData?.email}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Typography className="text-sm text-white/80">
                        Nama Instansi
                      </Typography>
                      <Typography className="text-sm font-medium text-white">
                        {scannedData?.tour?.name}
                      </Typography>
                    </div>

                    {/* Scanned Data Display */}
                    {/* <div className="mt-4 p-3 bg-black/20 rounded-lg">
                      <Typography className="text-xs text-white/60 mb-1">
                        Scanned Data:
                      </Typography>
                      <Typography className="text-xs text-white/80 font-mono break-all">
                        {scannedData}
                      </Typography>
                    </div> */}
                  </div>

                  <button
                    onClick={handleAddVisitor}
                    className="cursor-pointer w-full bg-[#1E3A5F] text-white py-4 px-6 font-medium mt-6"
                  >
                    Tambah Pengunjung
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <StickyFooter activeItem="Scan Visitor" />
      </div>
    </div>
  );
}
