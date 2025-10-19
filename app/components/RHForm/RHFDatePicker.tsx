import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

interface Props {
	name: string;
	label?: string;
	className?: string;
	disabled?: boolean;
	required?: boolean;
	placeholder?: string;
	onChange?: (date: Date | null) => void;
	format?: string;
	minDate?: Date;
	maxDate?: Date;
	disabledDateWeekend?: number[];
}

export default function RHFDatePicker({
	name,
	label,
	className,
	disabled,
	required,
	placeholder = "Pick a date",
	onChange,
	format: dateFormat = "PPP",
	minDate,
	maxDate,
	disabledDateWeekend,
}: Props) {
	const { control } = useFormContext();
	const [open, setOpen] = useState(false);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => {
				return (
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
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant={"outline"}
										className={cn(
											"w-full pl-3 text-left font-normal justify-start",
											!field.value &&
												"text-muted-foreground bg-hmmi-grey-100 border-ring ring-hmmi-grey-200 ring-[1.5px]",
											field.value &&
												"border-ring ring-hmmi-primary-900 ring-[1.5px]",
											error && "border-destructive"
										)}
										disabled={disabled}
									>
										<CalendarIcon className="h-4 w-4 opacity-50" />
										{field.value ? (
											format(field.value, dateFormat)
										) : (
											<span className="truncate">{placeholder}</span>
										)}
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="p-0" align="start">
								<Calendar
									mode="single"
									selected={field.value}
									onSelect={(date) => {
										field.onChange(date);
										onChange?.(date ?? null);
										setOpen(false);
									}}
									defaultMonth={field.value ?? new Date()} // ✅ this ensures the first open shows correct month
									captionLayout="dropdown"
									//@ts-ignore
									disabled={[
										minDate ? { before: minDate } : undefined,
										maxDate ? { after: maxDate } : undefined,
										disabledDateWeekend
											? { dayOfWeek: disabledDateWeekend }
											: undefined,
									].filter(Boolean)}
									className="w-full rounded-none"
								/>
							</PopoverContent>
						</Popover>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
