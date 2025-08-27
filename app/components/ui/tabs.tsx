// Tabs.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextType {
	activeTab: string;
	setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs = ({
	defaultValue,
	children,
}: {
	defaultValue: string;
	children: ReactNode;
}) => {
	const [activeTab, setActiveTab] = useState(defaultValue);
	return (
		<TabsContext.Provider value={{ activeTab, setActiveTab }}>
			<div className="w-full">{children}</div>
		</TabsContext.Provider>
	);
};

export const useTabsContext = () => {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error("Tabs component must be used within Tabs.Provider");
	}
	return context;
};
