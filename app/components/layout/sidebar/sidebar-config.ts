import useUser from "@/hooks/use-user";

export interface Items {
	id: string;
	title: string;
	url: string;
	isActive?: boolean;
	items?: Items[];
	authorized?: string[];
}

export function filterMenuByRole(menu: any[], role: string): any {
	return menu
		.filter(
			(item) =>
				item.authorized.includes("all") || item.authorized.includes(role)
		)
		.map((item) => ({
			...item,
			items: filterMenuByRole(item.items, role),
		}));
}

export const SIDEBAR_MENU = () => {
	const user = useUser();
	const role = user?.roles?.[0]?.name ?? "guest";

	let data = [
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
			authorized: ["Super", "PIC", "CMS"],
		},
		{
			id: "2",
			title: "Feedback",
			url: "/feedback",
			items: [],
			authorized: ["Super", "PIC", "CMS"],
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
					authorized: ["Super", "CMS"],
				},
				{
					id: "2",
					title: "Social Media",
					url: "/content-editor/social-media",
					items: [],
					authorized: ["Super", "CMS"],
				},
				{
					id: "3",
					title: "Article",
					url: "/content-editor/article",
					items: [],
					authorized: ["Super", "CMS"],
				},
				{
					id: "3",
					title: "Contact",
					url: "/content-editor/contact",
					items: [],
					authorized: ["Super", "CMS"],
				},
				{
					id: "3",
					title: "FAQ",
					url: "/content-editor/faq",
					items: [],
					authorized: ["Super", "CMS"],
				},
				{
					id: "3",
					title: "Legal",
					url: "/content-editor/legal",
					items: [],
					authorized: ["Super", "CMS"],
				},
				{
					id: "3",
					title: "About us",
					url: "/content-editor/about-us",
					items: [],
					authorized: ["Super", "CMS"],
				},
				{
					id: "3",
					title: "Registration Guide",
					url: "/content-editor/registration-guide",
					items: [],
					authorized: ["Super", "CMS"],
				},
				{
					id: "6",
					title: "Visit Setting",
					url: "/content-editor/setting-visit",
					items: [],
					authorized: ["Super", "CMS"],
				},
				{
					id: "6",
					title: "Top Menu",
					url: "/content-editor/top-menu",
					items: [],
					authorized: ["Super", "CMS"],
				},
				{
					id: "6",
					title: "Form Creator",
					url: "/content-editor/feedback",
					items: [],
					authorized: ["Super", "CMS"],
				},
			],
			authorized: ["Super", "CMS"],
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
					authorized: ["Super", "PIC"],
				},
				{
					id: "2",
					title: "Visitor Report",
					url: "/report/visitor-report",
					items: [],
					authorized: ["Super", "PIC"],
				},
				{
					id: "3",
					title: "Activity Report",
					url: "/report/activity-report",
					items: [],
					authorized: ["Super", "PIC"],
				},
				{
					id: "2",
					title: "User Report",
					url: "/report/user-report",
					items: [],
					authorized: ["Super", "PIC"],
				},
			],
			authorized: ["all"],
		},
		// {
		// 	id: "2",
		// 	title: "Whistleblower",
		// 	url: "/whistleblower",
		// 	items: [],
		// 	authorized: ["all"],
		// },
		{
			id: "5",
			title: "User Management",
			url: "/user-management",
			items: [],
			authorized: ["Super"],
		},
		{
			id: "6",
			title: "QR Scan",
			url: "/qr-scan",
			items: [],
			authorized: ["Super", "PIC"],
		},
		// {
		// 	id: "7",
		// 	title: "Logout",
		// 	url: "/dashboard",
		// 	items: [],
		// 	authorized: ["all"],
		// },
	];

	//return data;
	return filterMenuByRole(data, role);
};
