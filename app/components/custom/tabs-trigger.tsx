import { cn } from "@/lib/utils"; // or just use clsx/tailwind directly
import { useTabsContext } from "./tabs";

interface TabsTriggerProps {
	value: string;
	children: React.ReactNode;
}

export const TabsTrigger = ({ value, children }: TabsTriggerProps) => {
	const { activeTab, setActiveTab } = useTabsContext();
	const isActive = activeTab === value;

	return (
		<button
			onClick={() => setActiveTab(value)}
			className={cn(
				"w-full py-4 text-sm font-semibold text-center transition-colors cursor-pointer flex justify-center",
				isActive
					? "bg-[#153263] text-white rounded-sm"
					: "bg-white text-gray-800 hover:bg-gray-100"
			)}
		>
			{children}
		</button>
	);
};
