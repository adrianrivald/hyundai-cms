import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

interface Props {
	name: string;
	label?: string;
	placeholder?: string;
	description?: string;
	className?: string;
	disabled?: boolean;
	required?: boolean;
	rows?: number;
	maxLength?: number; // 👈 added
	showCounter?: boolean; // 👈 optional counter
}

export default function RHFTextArea({
	name,
	label,
	placeholder,
	description,
	className,
	disabled,
	required,
	rows = 3,
	maxLength,
	showCounter = false,
	...other
}: Props) {
	const { control } = useFormContext();
	const [count, setCount] = useState(0);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{label && (
						<FormLabel
							className={cn(
								required &&
									"after:content-['*'] after:ml-0.5 after:text-red-500"
							)}
						>
							{label}
						</FormLabel>
					)}

					<FormControl>
						<div className="relative">
							<Textarea
								placeholder={placeholder}
								className="resize-none"
								disabled={disabled}
								rows={rows}
								maxLength={maxLength} // 👈 applied
								{...field}
								{...other}
								onChange={(e) => {
									field.onChange(e);
									if (maxLength) setCount(e.target.value.length);
								}}
							/>
							{showCounter && maxLength && (
								<div className="text-xs text-muted-foreground absolute bottom-1 right-2">
									{count}/{maxLength}
								</div>
							)}
						</div>
					</FormControl>

					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
