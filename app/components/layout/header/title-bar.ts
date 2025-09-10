import { useLocation } from "react-router";
import { type Items, SIDEBAR_MENU } from "../sidebar/sidebar-config";

const isItemActive = (item: Items, pathname: string): boolean => {
	if (!pathname) return false;

	if (item.url === "/" && pathname === "/") return true;

	if (item.url && item.url !== "/" && pathname.startsWith(item.url)) {
		return true;
	}

	return item.items?.some((child) => isItemActive(child, pathname)) ?? false;
};

const findActiveItem = (items: Items[], pathname: string): Items | null => {
	for (const item of items) {
		if (isItemActive(item, pathname)) {
			if (item.items && item.items.length > 0) {
				const activeChild = findActiveItem(item.items, pathname);
				return activeChild || item;
			}
			return item;
		}
	}
	return null;
};

export const useActiveSidebarItem = (): Items | null => {
	const location = useLocation();
	const pathname = location.pathname;

	return findActiveItem(SIDEBAR_MENU(), pathname);
};
