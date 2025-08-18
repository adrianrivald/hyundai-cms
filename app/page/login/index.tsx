import FormProvider from "@/components/RHForm/FormProvider";
import RHFTextField from "@/components/RHForm/RHFTextField";
import Container from "@/components/container";
import { Grid } from "@/components/grid";
import { Stack } from "@/components/stack";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useForm } from "react-hook-form";

const LoginPage = () => {
	const isMobile = useIsMobile();
	const methods = useForm({
		defaultValues: {
			username: "",
			password: "",
		},
	});
	return (
		<Container className="py-0 max-h-screen">
			<Grid container>
				<Grid item xs={12} sm={6} md={6} className="min-h-screen flex flex-col">
					<div className="flex-1 flex flex-col items-center justify-center ">
						<div className=" w-[55%]">
							<img src="/images/logo.webp" className="w-[134px] h-[18px]" />
							<Typography className="text-4xl font-sans font-bold mt-4 text-hmmi-primary-500">
								Silakan masuk ke akun Anda
							</Typography>
							<Typography className="text-xs text-hmmi-grey-400">
								Masukan alamat email dan password untuk masuk ke akun anda.
							</Typography>
							<FormProvider methods={methods}>
								<div className="flex flex-col gap-4 mt-3">
									<RHFTextField
										name="email"
										label="Email"
										placeholder="Masukan alamat email"
									/>
									<RHFTextField
										name="password"
										label="Password"
										placeholder="Masukan Kata Sandi"
									/>
									<div className="cursor-pointer">
										<Typography className="text-sm font-medium text-right">
											Forgot Password ?
										</Typography>
									</div>

									<Button>Login</Button>
								</div>
							</FormProvider>
						</div>
					</div>
					<Typography className="text-xs mb-2 text-center text-hmmi-primary-900 font-normal">
						© {new Date().getFullYear()} Hyundai Motor Manufacturing Indonesia.
						All Rights Reserved.
					</Typography>
				</Grid>

				{!isMobile && (
					<Grid item xs={6}>
						<img
							src="/images/logo-login.webp"
							className="h-screen w-full object-cover"
							alt="Login Visual"
						/>
					</Grid>
				)}
			</Grid>
		</Container>
	);
};

export default LoginPage;
