import FormProvider from "@/components/RHForm/FormProvider";
import RHFTextField from "@/components/RHForm/RHFTextField";
import Container from "@/components/container";
import { Grid } from "@/components/grid";
import { Stack } from "@/components/stack";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";

const LoginPage = () => {
	const isMobile = useIsMobile();
	const methods = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
		shouldFocusError: false,
		resolver: yupResolver(
			yup.object().shape({
				email: yup.string().required("Email must be filled"),
				password: yup
					.string()
					.min(8, "Password must more than 8 character")
					.required("Password must be filled"),
			})
		),
	});

	const onSubmit = () => {};
	return (
		<Container className="py-0 max-h-screen">
			<Grid container>
				<Grid item xs={12} md={6} className="min-h-screen flex flex-col">
					<div className="flex-1 flex flex-col items-center justify-center ">
						<div className={cn(`${isMobile ? "w-[70%]" : "w-[55%]"}`)}>
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
										type="email"
										autoFocus={false}
										autoComplete={"email"}
										startIcon={
											<Icon
												icon="mage:email"
												width="20"
												height="20"
												color="#153263"
											/>
										}
									/>
									<RHFTextField
										name="password"
										label="Password"
										placeholder="Masukan Kata Sandi"
										type="password"
										startIcon={
											<Icon
												icon="solar:lock-linear"
												width="20"
												height="20"
												color="#153263"
											/>
										}
									/>
									<div className="cursor-pointer">
										<Typography className="text-sm font-medium text-right">
											Forgot Password ?
										</Typography>
									</div>

									<Button
										onClick={() => {
											methods.trigger().then((isValid) => {
												if (isValid) {
													onSubmit();
												}
											});
										}}
									>
										Login
									</Button>
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
