import { Checkbox } from "@/components/ui/checkbox";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
	name?: string;
	label?: ReactNode;
	description?: string;
	className?: string;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
	defaultChecked?: boolean;
}

export default function RHFCheckbox({
	name,
	label,
	description,
	className,
	disabled,
	onChange,
	defaultChecked = false,
	...other
}: Props) {
	const { control } = useFormContext();

	return (
		<FormField
			control={control}
			name={name || ""}
			render={({ field }) => (
				<FormItem
					className={cn(
						"flex flex-row items-start space-x-3 space-y-0",
						className
					)}
				>
					<FormControl>
						<Checkbox
							checked={defaultChecked ?? field.value}
							onCheckedChange={(checked) => {
								if (onChange) {
									onChange(checked as boolean);
								} else {
									field.onChange(checked);
								}
							}}
							disabled={disabled}
							{...other}
						/>
					</FormControl>
					<div className="space-y-1 leading-none items-center">
						{label && (
							<FormLabel className="text-sm pt-[3px] font-sans font-light leading-none">
								{label}
							</FormLabel>
						)}
						{description && <FormDescription>{description}</FormDescription>}
						<FormMessage />
					</div>
				</FormItem>
			)}
		/>
	);
}
