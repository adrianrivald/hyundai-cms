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
}: Props) {
	const { control } = useFormContext();

	return (
		<FormField
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => (
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
					<Popover>
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
									if (onChange && date) {
										onChange(date);
									}
								}}
								//@ts-ignore
								disabled={{ before: minDate, after: maxDate }}
								className="w-full rounded-none"
							/>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
