import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router";

interface FooterItem {
  icon: string;
  label: string;
  href: string;
}

interface StickyFooterProps {
  activeItem?: string;
}
const footerItems = [
  { icon: "mdi:home-outline", label: "Home", href: "/qr-scan" },
  {
    icon: "formkit:people",
    label: "Visitor List",
    href: "/qr-scan/visitor-list",
  },
  {
    icon: "dinkie-icons:scan",
    label: "Scan Visitor",
    href: "/qr-scan/scan-visitor",
  },
  {
    icon: "mingcute:settings-2-line",
    label: "Settings",
    href: "/qr-scan/settings",
  },
];

export default function StickyFooter({ activeItem }: StickyFooterProps) {
  const navigate = useNavigate();
  return (
    <div className="sticky bottom-0 left-0 right-0 flex justify-between px-7 py-4 gap-2 bg-opacity-50 backdrop-blur-md bg-[#091E41]">
      {footerItems.map(({ icon, label, href }) => {
        const isActive = activeItem === label;
        return (
          <div
            key={label}
            className={`flex flex-col items-center gap-2 cursor-pointer transition-all relative ${
              isActive
                ? "bg-[#1E3A5F]/10 px-3 py-2"
                : "hover:bg-white/10 px-3 py-2"
            }`}
            onClick={() => {
              navigate(href);
            }}
          >
            {/* Active indicator line */}
            {isActive && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-blue-500 rounded-full"></div>
            )}
            <Icon
              icon={icon}
              width="26"
              height="26"
              className={isActive ? "text-blue-500" : "text-white"}
            />
            <Typography
              className={`text-xs ${isActive ? "text-blue-500" : "text-white"}`}
            >
              {label}
            </Typography>
          </div>
        );
      })}
    </div>
  );
}
