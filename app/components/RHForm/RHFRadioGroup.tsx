import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { JSXElementConstructor, ReactElement, ReactNode } from "react";
import { useFormContext } from "react-hook-form";

interface IProps {
	label?: string;
	name: string;
	options: string[] | number[];
	values?: (string | number)[];
	preventClick?: boolean;
	getOptionLabel?:
		| string[]
		| number[]
		| ReactElement<any, string | JSXElementConstructor<any>>[];
	size?: "sm" | "default";
	helperText?: ReactNode;
	direction?: "row" | "column";
	className?: string;
	containerRadioProps?: string;
	onChange?: (value: string) => void;
}

export default function RHFRadioGroup({
	label,
	name,
	options,
	values,
	getOptionLabel,
	preventClick,
	size = "default",
	helperText,
	direction = "row",
	className,
	containerRadioProps,
	onChange,
}: IProps) {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{label && <FormLabel>{label}</FormLabel>}

					<FormControl>
						<RadioGroup
							onValueChange={(value) => {
								if (onChange) {
									onChange(value);
								} else {
									field.onChange(value);
								}
							}}
							defaultValue={field.value}
							className={cn(
								"flex gap-4",
								direction === "column" ? "flex-col" : "flex-row flex-wrap",
								containerRadioProps
							)}
							disabled={preventClick}
						>
							{options.map((option, index) => {
								const value = values ? String(values[index]) : String(option);
								const label = getOptionLabel?.length
									? getOptionLabel[index]
									: option;

								return (
									<div key={value} className="flex items-center space-x-3">
										<RadioGroupItem
											value={value}
											id={`${name}-${index}`}
											className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5")}
										/>
										<label
											htmlFor={`${name}-${index}`}
											className={cn(
												"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
												size === "sm" ? "text-sm" : "text-base"
											)}
										>
											{label}
										</label>
									</div>
								);
							})}
						</RadioGroup>
					</FormControl>

					{(!!errors[name] || helperText) && (
						<FormMessage>
							{(errors[name]?.message as string) || helperText}
						</FormMessage>
					)}
				</FormItem>
			)}
		/>
	);
}
