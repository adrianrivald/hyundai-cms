import { useOfflineMode } from "@/hooks/use-offline-mode";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Typography } from "@/components/typography";

export function OfflineIndicator() {
  const { isOnline } = useOfflineMode();

  if (isOnline) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-2 rounded-full">
      <Icon
        icon="mdi:wifi-off"
        width="16"
        height="16"
        className="text-orange-500"
      />
      <Typography className="text-xs text-orange-500 font-medium">
        Offline Mode
      </Typography>
    </div>
  );
}
