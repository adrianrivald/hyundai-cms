import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/70",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/50",
				info: "bg-info text-info-foreground hover:bg-info/50",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-gray-300 text-secondary-foreground hover:bg-gray-200",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				success: "bg-[#59AD24] text-white hover:bg-[#59AD24]/50",
				white: "bg-white text-black hover:bg-gray-100",

				hmmiPrimary:
					"bg-hmmi-primary-900 text-white hover:bg-hmmi-primary-700 disabled:bg-hmmi-grey-200 disabled:text-hmmi-grey-400",
				hmmiOutline:
					"border border-hmmi-primary-900 bg-background text-hmmi-primary-900 hover:bg-hmmi-primary-50 disabled:border-hmmi-grey-200 disabled:text-hmmi-grey-400",
				hmmiGhost:
					"hover:bg-hmmi-primary-50 hover:text-accent-foreground text-hmmi-primary-500",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "hmmiPrimary",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	loading?: boolean;
	loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			loading,
			loadingText = "Please wait",
			type = "button",
			disabled,
			variant,
			size,
			asChild = false,
			startIcon,
			endIcon,
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				type={type}
				ref={ref}
				disabled={disabled || loading}
				{...props}
			>
				{loading && <Loader2Icon className="animate-spin" />}
				{!loading && startIcon}
				{loading ? loadingText : children}
				{!loading && endIcon}
			</Comp>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
