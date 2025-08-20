export interface Items {
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
		url: "/",
		items: [],
		authorized: ["all"],
	},
	{
		id: "2",
		title: "Calendar",
		url: "/calendar",
		items: [],
		authorized: ["all"],
	},
	{
		id: "3",
		title: "Report",
		url: "",
		items: [
			{
				id: "1",
				title: "Registration Report",
				url: "/report/registration-report",
				items: [],
				authorized: ["all"],
			},
			{
				id: "2",
				title: "Visitor Report",
				url: "/report/visitor-report",
				items: [],
				authorized: ["all"],
			},
			{
				id: "3",
				title: "Activity Report",
				url: "/report/activity-report",
				items: [],
				authorized: ["all"],
			},
			{
				id: "2",
				title: "User Report",
				url: "/report/user-report",
				items: [],
				authorized: ["all"],
			},
		],
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
		title: "User Management",
		url: "/user-management",
		items: [],
		authorized: ["all"],
	},
	{
		id: "6",
		title: "Logout",
		url: "/dashboard",
		items: [],
		authorized: ["all"],
	},
];
