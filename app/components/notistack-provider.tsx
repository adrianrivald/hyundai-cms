import { cn } from "@/lib/utils";
import { SnackbarContent, SnackbarProvider, useSnackbar } from "notistack";
import { type ReactNode, forwardRef, useCallback, useRef } from "react";
import { Iconify } from "./iconify";
import { Alert, AlertDescription } from "./ui/alert";

interface NotistackProviderProps {
	children: ReactNode;
}

const SnackbarComponent = forwardRef<HTMLDivElement, any>(
	({ id, type, ...props }, ref) => {
		const { closeSnackbar } = useSnackbar();

		const handleDismiss = useCallback(() => {
			closeSnackbar(id);
		}, [id, closeSnackbar]);

		const headerTitle = () => {
			switch (props.variant) {
				case "success":
					return "Success";
				case "error":
					return "Error";
				case "info":
					return "Info";
				default:
					return "Alert";
			}
		};

		const headerIcon = () => {
			switch (props.variant) {
				case "success":
					return "lets-icons:check-fill";
				case "error":
					return "lucide:circle-x";
				case "info":
					return "mdi:alert-circle-outline";
				default:
					return "mdi:alert-circle-outline";
			}
		};

		const iconColor = () => {
			switch (props.variant) {
				case "success":
					return "#008000";
				case "error":
					return "#FF0000";
				case "info":
					return "#0000FF";
				default:
					return "#0000FF";
			}
		};

		const getColorClass = () => {
			switch (props.variant) {
				case "success":
					return "text-green-500";
				case "error":
					return "text-red-500";
				case "info":
					return "text-blue-500";
				default:
					return "text-blue-500";
			}
		};

		return (
			<SnackbarContent ref={ref}>
				<Alert
					className="shadow-xl border-0 rounded-[10px] w-[500px] max-w-[500px] mt-5 gap-2"
					onClick={() => {
						handleDismiss();
					}}
				>
					<div className="flex-row flex items-center gap-1 pt-2 pb-3">
						<Iconify
							icon={headerIcon()}
							width={28}
							height={28}
							className="mr-2"
							color={iconColor()}
						/>
						<div className={cn("text-md font-sans font-bold", getColorClass())}>
							{headerTitle()}
						</div>
					</div>

					<AlertDescription className="text-sm font-sans font-medium">
						{props.message}
					</AlertDescription>
				</Alert>
			</SnackbarContent>
		);
	}
);

declare module "notistack" {
	interface VariantOverrides {
		type: "default" | "success" | "error" | "info";
	}
}

export function NotistackProvider({ children }: NotistackProviderProps) {
	const notistackRef = useRef<any>(null);

	return (
		<SnackbarProvider
			ref={notistackRef}
			maxSnack={5}
			preventDuplicate
			hideIconVariant
			autoHideDuration={1200}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			Components={{
				default: SnackbarComponent,
				error: SnackbarComponent,
				success: SnackbarComponent,
				info: SnackbarComponent,
			}}
		>
			{children}
		</SnackbarProvider>
	);
}
