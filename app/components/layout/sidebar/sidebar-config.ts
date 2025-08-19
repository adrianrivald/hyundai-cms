interface Items {
	id: string;
	title: string;
	url: string;
	isActive?: boolean;
	items?: Items[];
	authorized?: string[];
}

export const SIDEBAR_MENU: Items[] = [
	{
		id: "1",
		title: "Dashboard",
		url: "/dashboard",
		items: [],
		authorized: ["all"],
	},
	{
		id: "2",
		title: "Calendar",
		url: "/dashboard",
		items: [],
		authorized: ["all"],
	},
	{
		id: "3",
		title: "Report",
		url: "/dashboard",
		items: [],
		authorized: ["all"],
	},
	{
		id: "4",
		title: "Content Editor",
		url: "",
		items: [
			{
				id: "1",
				title: "Homepage",
				url: "/dashboard",
				items: [],
				authorized: ["all"],
			},
			{
				id: "2",
				title: "Social Media",
				url: "/dashboard",
				items: [],
				authorized: ["all"],
			},
			{
				id: "3",
				title: "Tour",
				url: "/dashboard",
				items: [],
				authorized: ["all"],
			},
			{
				id: "4",
				title: "FAQ",
				url: "/dashboard",
				items: [],
				authorized: ["all"],
			},
		],
		authorized: ["all"],
	},
	{
		id: "5",
		title: "Logout",
		url: "/dashboard",
		items: [],
		authorized: ["all"],
	},
];
