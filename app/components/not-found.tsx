import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface NotFoundProps {
	message?: string;
	onClick?: () => void;
	btnName?: string;
}

export default function NotFound({ message, onClick, btnName }: NotFoundProps) {
	const navigate = useNavigate();
	return (
		<Container className="">
			<div className="w-full h-[100vh] flex flex-row justify-center">
				<div className="flex flex-col items-center justify-center gap-5">
					<img
						src={`/images/logo.webp`}
						className="w-[200px] h-[40px] bg-contain object-contain"
						aria-label="logo"
					/>
					<div className="w-full text-center">
						<div className="text-xl font-bold font-sans text-hmmi-primary-900">
							Not Found
						</div>
						<div className="mt-3 font-sans text-hmmi-primary-900">
							{message ||
								"The page you are looking for might have been removed had its name changed or is temporarily unavailable."}
						</div>
						<Button
							className="mt-5"
							onClick={() => {
								if (onClick) {
									onClick();
								} else {
									navigate("/", { replace: true });
								}
							}}
						>
							{btnName || "Back to Dashboard"}
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
}
