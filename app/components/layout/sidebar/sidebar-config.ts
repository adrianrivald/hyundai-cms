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
		id: "4",
		title: "Content Editor",
		url: "/content-editor",
		items: [
			{
				id: "1",
				title: "Homepage",
				url: "/content-editor/homepage",
				items: [],
				authorized: ["all"],
			},
			{
				id: "2",
				title: "Social Media",
				url: "/content-editor/social-media",
				items: [],
				authorized: ["all"],
			},
			{
				id: "3",
				title: "Artikel",
				url: "/content-editor/article",
				items: [],
				authorized: ["all"],
			},
			{
				id: "3",
				title: "Contact",
				url: "/content-editor/contact",
				items: [],
				authorized: ["all"],
			},
			{
				id: "3",
				title: "FAQ",
				url: "/content-editor/faq",
				items: [],
				authorized: ["all"],
			},
			{
				id: "3",
				title: "Legal",
				url: "/content-editor/legal",
				items: [],
				authorized: ["all"],
			},
			{
				id: "3",
				title: "About us",
				url: "/content-editor/about-us",
				items: [],
				authorized: ["all"],
			},
			{
				id: "3",
				title: "Registration Guide",
				url: "/content-editor/registration-guide",
				items: [],
				authorized: ["all"],
			},
		],
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
		url: "/report/",
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
		id: "2",
		title: "Whistleblower",
		url: "/calendar",
		items: [],
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
		title: "QR Scan",
		url: "/qr-scan",
		items: [],
		authorized: ["all"],
	},
	{
		id: "7",
		title: "Logout",
		url: "/dashboard",
		items: [],
		authorized: ["all"],
	},
];
