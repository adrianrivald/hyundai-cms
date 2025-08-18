import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function NotAuthorized() {
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
							You are not authorized
						</div>
						<div className="mt-3 font-sans text-hmmi-primary-900">
							It seems like you don't have permission access to this page.
							Please retry signing in for a few minutes or contact your support.
						</div>
						<Button
							className="mt-5"
							onClick={() => {
								navigate("/", { replace: true });
							}}
						>
							Back to Dashboard
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
}
