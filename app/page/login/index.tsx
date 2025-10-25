import FormProvider from "@/components/RHForm/FormProvider";
import RHFTextField from "@/components/RHForm/RHFTextField";
import Container from "@/components/container";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { useLogin } from "@/api/auth";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useToken from "@/hooks/use-token";
import { useNavigate } from "react-router";

const LoginPage = () => {
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const [loginError, setLoginError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const methods = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onSubmit",
		reValidateMode: "onChange",
		resolver: yupResolver(
			yup.object().shape({
				email: yup
					.string()
					.required("Email is required")
					.matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email must be valid"),
				password: yup
					.string()
					.min(4, "Password must be more than 4 characters")
					.required("Password is required"),
			})
		),
	});
	const token = useToken();

	useEffect(() => {
		if (token) {
			navigate("/");
		}
	}, []);

	const { mutate, isPending } = useLogin({});

	const onSubmit = () => {
		setLoginError("");
		const data = methods.watch();
		mutate(
			{ email: data.email, password: data.password },
			{
				onSuccess: () => {
					navigate("/");
					enqueueSnackbar("Login Success", {
						variant: "success",
					});
				},
				onError: (err) => {
					setLoginError("Wrong email or password.");
				},
			}
		);
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<Container className="py-0 my-0">
			<Grid container>
				<Grid item xs={12} md={6} className="min-h-[100vh] flex flex-col">
					<div className="flex-1 flex flex-col items-center justify-center ">
						<div className={cn(`${isMobile ? "w-[70%]" : "w-[55%]"}`)}>
							<img src="/images/logo.webp" className="w-[134px] h-[18px]" />
							<Typography className="text-4xl font-sans font-bold mt-4 ">
								Sign in to your account
							</Typography>
							<Typography className="text-xs text-hmmi-grey-400">
								Please enter your email and password to sign in.
							</Typography>
							<FormProvider
								methods={methods}
								onSubmit={methods.handleSubmit(onSubmit)}
							>
								<div className="flex flex-col gap-4 mt-3">
									<RHFTextField
										name="email"
										label="Email"
										placeholder="Input email address"
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
										placeholder="Input password"
										type={showPassword ? "text" : "password"}
										startIcon={
											<Icon
												icon="solar:lock-linear"
												width="20"
												height="20"
												color="#153263"
											/>
										}
										endIcon={
											<div
												onClick={togglePasswordVisibility}
												className="mr-3 cursor-pointer"
											>
												{showPassword ? (
													<Icon icon="solar:eye-bold" width="20" height="20" />
												) : (
													<Icon
														icon="solar:eye-closed-bold"
														width="20"
														height="20"
													/>
												)}
											</div>
										}
									/>
									<Typography className="text-red-500 text-center">
										{loginError}
									</Typography>
									<div className="cursor-pointer">
										<Typography className="text-sm font-medium text-right">
											Forgot Password ?
										</Typography>
									</div>

									<Button
										type="submit"
										loading={isPending}
										disabled={isPending}
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
							className="min-h-[100vh] w-full object-cover"
							alt="Login Visual"
						/>
					</Grid>
				)}
			</Grid>
		</Container>
	);
};

export default LoginPage;
