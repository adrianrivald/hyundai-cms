import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import RHFTextField from "./RHForm/RHFTextField";
import { Typography } from "./typography";
import { Button } from "./ui/button";
import FormProvider from "./RHForm/FormProvider";

const AuthenticationPage = () => {
	const isAnyCookies = Cookies.get("hmmi_cookies");
	const methods = useForm({
		defaultValues: {
			username: "",
			password: "",
			wrong: "",
		},
	});

	const onSubmit = () => {
		const form = methods.watch();
		console.log("daataa", methods.watch());
		if (form.username === "HMMI-Tester" && form.password === "Hyund@1FTP!!") {
			Cookies.set("hmmi_cookies", form.username, {
				sameSite: "strict",
			});
			window.location.reload();
		} else {
			methods.setError("wrong", {
				message: "Username or password is incorrect",
			});
		}
	};

	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<Typography>Login to see the site</Typography>
			<div className="mt-5 w-[600px]">
				<FormProvider methods={methods}>
					<RHFTextField
						name="username"
						label="Username"
						placeholder="Username"
					/>
					<div className="my-5" />
					<RHFTextField
						name="password"
						label="Password"
						placeholder="Password"
						className="w-full"
						type="password"
					/>

					{methods.formState?.errors?.wrong?.message && (
						<Typography className="mt-3 text-red-500 text-center">
							{methods.formState?.errors?.wrong?.message}
						</Typography>
					)}

					<Button
						className="mt-5 w-[150px]"
						onClick={() => {
							onSubmit();
						}}
					>
						Login
					</Button>
				</FormProvider>
			</div>
		</div>
	);
};

export default AuthenticationPage;
