import useToken from "@/hooks/use-token";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

interface PageAuthorizationProps {
	role?: string[];
	children: ReactNode;
}

const PageAuthorization = ({ role, children }: PageAuthorizationProps) => {
	const navigate = useNavigate();
	const token = useToken();

	useEffect(() => {
		if (!token) {
			navigate("/login");
			return;
		}
	}, [token]);

	return <div>{children}</div>;
};

export default PageAuthorization;
