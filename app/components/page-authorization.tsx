import useToken from "@/hooks/use-token";
import useUser from "@/hooks/use-user";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

interface PageAuthorizationProps {
	role?: string[];
	children: ReactNode;
}

const PageAuthorization = ({ role, children }: PageAuthorizationProps) => {
	const navigate = useNavigate();
	const token = useToken();
	const user = useUser();
	const userRole = user?.roles?.[0]?.name ?? "guest";

	useEffect(() => {
		if (!token) {
			navigate("/login");
			return;
		}

		// if (!role?.includes("all") && !role?.includes(userRole)) {
		// 	navigate("/not-authorized"); // ⬅️ create this page or redirect somewhere safe
		// 	return;
		// }
	}, [token]);

	return <div>{children}</div>;
};

export default PageAuthorization;
