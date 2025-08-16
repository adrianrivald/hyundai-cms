import Container from "@/components/container";
import { Grid } from "@/components/grid";
import { Stack } from "@/components/stack";
import { Typography } from "@/components/typography";
import { useIsMobile } from "@/hooks/use-mobile";

const LoginPage = () => {
	const isMobile = useIsMobile();
	return (
		<Container className="py-0 h-screen">
			<Grid container>
				<Grid item xs={12} sm={6} md={6}></Grid>
				{!isMobile && (
					<Grid item xs={6}>
						<img
							src="/images/logo-login.webp"
							className="h-screen object-cover"
						/>
					</Grid>
				)}
			</Grid>
		</Container>
	);
};

export default LoginPage;
