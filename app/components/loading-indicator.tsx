import { Icon } from "@iconify/react";
import { Typography } from "./typography";

interface LoadingIndicatorProps {
	text: string;
}

export function LoadingIndicator({ text = "page" }: LoadingIndicatorProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm gap-3">
			<Icon
				icon="line-md:loading-loop"
				className="text-primary text-5xl animate-spin"
			/>
			<Typography>Loading {text}</Typography>
		</div>
	);
}
