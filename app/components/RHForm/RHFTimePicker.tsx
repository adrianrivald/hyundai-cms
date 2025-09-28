import { Button } from "@/components/ui/button";
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
import { Clock } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { useMemo } from "react";

interface Props {
	name: string;
	label?: string;
	className?: string;
	disabled?: boolean;
	required?: boolean;
	placeholder?: string;
	onChange?: (time: string | null) => void;
	interval?: number; // in minutes (default 30)
	format?: string; // time format, default "HH:mm"
	minTime?: string; // e.g. "09:00"
	maxTime?: string; // e.g. "18:00"
	disabledTimes?: string[];
}

export default function RHFTimePicker({
	name,
	label,
	className,
	disabled,
	required,
	placeholder = "Pick a time",
	onChange,
	interval = 30,
	format: timeFormat = "HH:mm",
	minTime = "00:00",
	maxTime = "23:59",
	disabledTimes = [], // ⬅️ default empty
}: Props) {
	const { control } = useFormContext();

	// Generate time slots as strings (HH:mm)
	const timeSlots = useMemo(() => {
		const times: string[] = [];
		const [minH, minM] = minTime.split(":").map(Number);
		const [maxH, maxM] = maxTime.split(":").map(Number);

		const start = new Date();
		start.setHours(minH, minM, 0, 0);

		const end = new Date();
		end.setHours(maxH, maxM, 0, 0);

		for (
			let d = new Date(start);
			d <= end;
			d.setMinutes(d.getMinutes() + interval)
		) {
			times.push(format(new Date(d), timeFormat));
		}
		return times;
	}, [interval, minTime, maxTime, timeFormat]);

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
									<Clock className="h-4 w-4 opacity-50" />
									{field.value ? (
										field.value
									) : (
										<span className="truncate">{placeholder}</span>
									)}
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent
							className="p-2 max-h-60 overflow-y-auto"
							align="start"
						>
							<div className="grid grid-cols-3 gap-2">
								{timeSlots.map((label) => {
									const isDisabled = disabledTimes.includes(label);

									return (
										<Button
											key={label}
											type="button"
											variant={field.value === label ? "default" : "outline"}
											size="sm"
											className="w-full"
											disabled={isDisabled}
											onClick={() => {
												if (isDisabled) return;
												field.onChange(label);
												if (onChange) onChange(label);
											}}
										>
											{label}
										</Button>
									);
								})}
							</div>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
