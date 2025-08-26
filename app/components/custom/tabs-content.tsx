import { useTabsContext } from "./tabs";
import { type ReactNode } from "react";

interface TabsContentProps {
	value: string;
	children: ReactNode;
}

export const TabsContent = ({ value, children }: TabsContentProps) => {
	const { activeTab } = useTabsContext();

	if (activeTab !== value) return null;

	return <div className="mt-4">{children}</div>;
};
