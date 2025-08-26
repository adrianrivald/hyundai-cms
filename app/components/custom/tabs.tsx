// import { Grid } from "../grid";
// import { Typography } from "../typography";

// const Tabs = () => {
// 	return (
// 		<Grid className=" bg-white rounded-sm" container>
// 			<Grid item sm={4} className="py-4 bg-[#153263] rounded-sm">
// 				<Typography className="font-semibold text-sm text-center text-white">
// 					Daftar Banner
// 				</Typography>
// 			</Grid>
// 			<Grid item sm={4} className="py-4">
// 				<Typography className="font-semibold text-sm text-center">
// 					Daftar Tour
// 				</Typography>
// 			</Grid>
// 			<Grid item sm={4} className="py-4">
// 				<Typography className="font-semibold text-sm text-center">
// 					Daftar Pabrik
// 				</Typography>
// 			</Grid>
// 		</Grid>
// 	);
// };

// export default Tabs;

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
