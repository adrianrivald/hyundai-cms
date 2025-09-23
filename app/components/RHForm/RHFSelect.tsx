import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormControl,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

interface RHFSelectProps<T> {
	name: string;
	label?: string;
	required?: boolean;
	placeholder?: string;
	className?: string;
	options: T[];
	getOptionLabel: (option: T) => string;
	getOptionValue: (option: T) => string;
	disabled?: boolean;
	disableClearable?: boolean;
	onChange?: (value: string) => void;
}

export default function RHFSelect<T>({
	name,
	label,
	required,
	placeholder = "Select an option",
	className,
	options,
	getOptionLabel,
	getOptionValue,
	disabled = false,
	disableClearable = false,
	onChange,
}: RHFSelectProps<T>) {
	const { control } = useFormContext();

	return (
		<FormField
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<FormItem className={cn("space-y-2", className)}>
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
						<div className="relative w-full">
							<Select
								value={field.value}
								onValueChange={(val) => {
									field.onChange(val);
									onChange?.(val);
								}}
								disabled={disabled}
							>
								<SelectTrigger
									className={cn(
										"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-12 w-full min-w-0 border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none text-sm",
										"border-ring ring-hmmi-primary-900 ring-[1.5px]",
										"data-[placeholder]:bg-hmmi-grey-100 data-[placeholder]:border-ring data-[placeholder]:ring-hmmi-grey-200 data-[placeholder]:ring-[1.5px]",
										"focus:bg-white focus:shadow-gray-500 focus:shadow-lg focus-visible:border-ring focus-visible:ring-hmmi-primary-900 focus-visible:ring-[1.5px]",
										"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
										error &&
											"border-destructive ring-destructive focus:ring-destructive "
									)}
								>
									<SelectValue placeholder={placeholder} />
								</SelectTrigger>
								<SelectContent className="">
									{options.map((option) => {
										const value = getOptionValue(option);
										const label = getOptionLabel(option);
										return (
											<SelectItem
												key={value}
												value={value}
												className="border-b-[0.5px] py-2 data-[highlighted]:bg-hmmi-primary-900 data-[highlighted]:text-white data-[state=checked]:bg-hmmi-primary-900 data-[state=checked]:text-white"
											>
												{label}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>

							{field.value && !disableClearable && (
								<button
									type="button"
									onClick={() => {
										field.onChange("");
										onChange?.("");
									}}
									className="cursor-pointer absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100"
								>
									<X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
								</button>
							)}
						</div>
					</FormControl>

					{error?.message && <FormMessage>{error.message}</FormMessage>}
				</FormItem>
			)}
		/>
	);
}
