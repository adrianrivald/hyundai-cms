import { Typography } from "@/components/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react/dist/iconify.js";
import StickyFooter from "@/components/layout/sticky-footer";
import StickyHeader from "@/components/layout/sticky-header";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function ScanVisitor() {
  const [isScanned, setIsScanned] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scannedData, setScannedData] = useState<string>("");

  const footerItems = [
    { icon: "formkit:people", label: "Visitor List" },
    { icon: "dinkie-icons:scan", label: "Scan Visitor" },
    { icon: "mdi:register-outline", label: "New Regs" },
    { icon: "mingcute:settings-2-line", label: "Settings" },
  ];

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      setScannedData(result);

      // Try to parse JSON data from QR code
      try {
        const visitorData = JSON.parse(result);
        console.log("Parsed visitor data:", visitorData);
        // You can use this data to populate the visitor details
      } catch (error) {
        console.log("QR code data is not JSON format:", result);
      }

      setIsScanned(true);
    }
  };

  const handleError = (error: unknown) => {
    console.error("QR Scanner error:", error);
  };

  const handleManualScan = () => {
    // Simulate manual code entry
    setScannedData("manual-entry-123");
    setIsScanned(true);
  };

  const handleAddVisitor = () => {
    // Handle add visitor action
    console.log("Add visitor clicked", scannedData);
    // Reset scanner after adding visitor
    setIsScanned(false);
    setScannedData("");
  };

  const handleResetScanner = () => {
    setIsScanned(false);
    setScannedData("");
  };

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

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Page Title */}
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="w-1/3"></div>
            <div className="w-1/3 flex justify-center items-center">
              <Typography className="text-xl font-bold text-white">
                Scan Visitor
              </Typography>
            </div>
            <div className="w-1/3 flex justify-end items-center">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
                  <button
                    onClick={handleManualScan}
                    className="w-full bg-[#1E3A5F] text-white py-3 px-6 rounded-lg font-medium"
                  >
                    Insert Code
                  </button>
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

                  {/* Insert Code Button */}
                  <button
                    onClick={handleResetScanner}
                    className="w-full bg-[#1E3A5F] text-white py-3 px-6 rounded-lg font-medium blur-sm"
                  >
                    Insert Code
                  </button>
                </div>

                {/* Visitor Detail Card */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#1E3A5F] rounded-t-2xl p-6">
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
                        <Typography className="text-sm text-white/80">
                          Nama
                        </Typography>
                        <Typography className="text-sm font-medium text-white">
                          Andreas Kholilbi
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-sm text-white/80">
                          No. HP
                        </Typography>
                        <Typography className="text-sm font-medium text-white">
                          081321245212
                        </Typography>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <Typography className="text-sm text-white/80">
                          Jenis Kelamin
                        </Typography>
                        <Typography className="text-sm font-medium text-white">
                          Laki - laki
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-sm text-white/80">
                          Email
                        </Typography>
                        <Typography className="text-sm font-medium text-white">
                          anas@gmail.com
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography className="text-sm text-white/80">
                        Nama Instansi
                      </Typography>
                      <Typography className="text-sm font-medium text-white">
                        SMK Adijaya Ciputat
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
                    className="w-full bg-[#0F1B2E] text-white py-3 px-6 rounded-lg font-medium mt-6"
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
