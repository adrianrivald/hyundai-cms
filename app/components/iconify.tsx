import { Icon } from "@iconify/react";
import type { ComponentProps } from "react";

interface IconifyProps extends ComponentProps<typeof Icon> {
	icon: string;
}
export const Iconify = ({ icon, className, ...props }: IconifyProps) => {
	return <Icon className={`p-1 ${className}`} icon={icon} {...props} />;
};
