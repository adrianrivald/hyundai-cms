import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
					"border-ring ring-hmmi-primary-900 ring-[1.5px]",
					"placeholder-shown:bg-hmmi-grey-100 placeholder-shown:border-ring placeholder-shown:ring-hmmi-grey-200 placeholder-shown:ring-[1.5px]", // gray when empty
					"focus:bg-white focus:shadow-gray-500 focus:shadow-lg focus-visible:border-ring focus-visible:ring-hmmi-primary-900 focus-visible:ring-[1.5px]",
					"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);

Input.displayName = "Input";

export { Input };
