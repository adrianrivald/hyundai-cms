import { Checkbox } from "@/components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

interface IProps<T = any> {
	label?: string;
	name: string;
	options: T[];

	getOptionLabel?: (item: T, index: number) => string;
	getOptionValue?: (item: T) => any;
	preventClick?: boolean;
	size?: "sm" | "default";
	helperText?: ReactNode;
	direction?: "row" | "column";
	className?: string;
	containerBox?: string;
}

export default function RHFCheckboxGroup<T>({
	label,
	name,
	options,

	getOptionLabel,
	getOptionValue = (item) => item,
	preventClick,
	size = "default",
	helperText,
	direction = "row",
	className,
	containerBox,
}: IProps<T>) {
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
						<div
							className={cn(
								"flex gap-4",
								direction === "column" ? "flex-col" : "flex-row flex-wrap",
								containerBox
							)}
						>
							{options.map((option, index) => {
								const optionValue = getOptionValue(option);
								const optionLabel = getOptionLabel
									? getOptionLabel(option, index)
									: ((option as any)?.label ?? String(optionValue));

								const isChecked = field.value?.some(
									(v: any) => getOptionValue(v) === optionValue
								);

								return (
									<div
										key={optionValue}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={`${name}-${index}`}
											disabled={preventClick}
											checked={isChecked}
											onCheckedChange={(checked) => {
												const currentValues: T[] = field.value || [];
												const newValues = checked
													? [...currentValues, option]
													: currentValues.filter(
															(v) => getOptionValue(v) !== optionValue
														);

												field.onChange(newValues);
											}}
											className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5")}
										/>
										<label
											htmlFor={`${name}-${index}`}
											className={cn(
												"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
												size === "sm" ? "text-sm" : "text-base"
											)}
										>
											{optionLabel}
										</label>
									</div>
								);
							})}
						</div>
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
