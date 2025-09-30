import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface RHFSelectMultipleProps<T> {
	name: string;
	label?: string;
	required?: boolean;
	options: T[];
	placeholder?: string;
	className?: string;
	getOptionLabel: (option: T) => string;
	getOptionValue: (option: T) => string;
	onChange?: (selectedOptions: T[]) => void;
	onScrollEnd?: () => void;
	onSearch?: (searchText: string) => void;
	loading?: boolean;
	disabled?: boolean;
}

export default function RHFSelectMultiple<T>({
	name,
	label,
	required,
	options,
	placeholder = "Select options",
	className,
	getOptionLabel,
	getOptionValue,
	onChange,
	onScrollEnd,
	onSearch,
	loading = false,
	disabled = false,
}: RHFSelectMultipleProps<T>) {
	const { control } = useFormContext();
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (onSearch) {
				onSearch(search);
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [search, onSearch]);

	const filteredOptions = useMemo(() => {
		if (onSearch) {
			return options;
		}
		return options.filter((option) =>
			getOptionLabel(option).toLowerCase().includes(search.toLowerCase())
		);
	}, [search, options, getOptionLabel, onSearch]);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<div className="space-y-2">
					{label && (
						<Label htmlFor={name}>
							{label}
							{required && <span className="text-destructive ml-1">*</span>}
						</Label>
					)}

					<div className="space-y-3">
						<Popover open={open} onOpenChange={setOpen} modal={true}>
							<PopoverTrigger asChild>
								<Button
									disabled={disabled}
									variant="outline"
									role="combobox"
									aria-expanded={open}
									className={cn(
										"w-full justify-between h-[40px]",
										error?.message && "border-destructive",
										className
									)}
								>
									<div className="truncate ">
										{Array.isArray(field.value) && field.value.length > 0 ? (
											<div className="flex overflow-x-auto gap-2 pb-1 pt-3">
												{field.value.map((id: string) => {
													const option = options.find(
														(opt) => getOptionValue(opt) === id
													);
													return (
														<div
															key={id}
															className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
														>
															<span className="text-sm">
																{option ? getOptionLabel(option) : id}
															</span>
															<X
																className="h-3 w-3 cursor-pointer hover:text-destructive"
																onClick={() => {
																	const newValue = field.value.filter(
																		(v: string) => v !== id
																	);
																	field.onChange(newValue);
																	onChange?.(newValue);
																}}
															/>
														</div>
													);
												})}
											</div>
										) : (
											<span className="text-muted-foreground">
												{placeholder}
											</span>
										)}
									</div>

									<div className="flex gap-2 items-center">
										{loading && <Loader2 className="h-4 w-4 animate-spin" />}
										<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
									</div>
								</Button>
							</PopoverTrigger>

							<PopoverContent
								className="w-[var(--radix-popover-trigger-width)] p-0"
								align="start"
							>
								<Command shouldFilter={false}>
									<CommandInput
										placeholder="Search..."
										value={search}
										onValueChange={setSearch}
									/>
									<CommandList
										className="max-h-[200px]"
										onScroll={(e) => {
											const target = e.currentTarget;
											const scrollPosition =
												target.scrollTop + target.clientHeight;
											const scrollThreshold = target.scrollHeight - 50;

											if (
												scrollPosition >= scrollThreshold &&
												onScrollEnd &&
												!loading
											) {
												onScrollEnd();
											}
										}}
									>
										{loading ? (
											<div className="flex items-center justify-center py-4">
												<Loader2 className="h-6 w-6 animate-spin" />
											</div>
										) : (
											<CommandEmpty>No options found.</CommandEmpty>
										)}

										<CommandGroup>
											{filteredOptions.map((option) => {
												const value = getOptionValue(option);
												const label = getOptionLabel(option);
												const isSelected = field.value?.includes(value);

												return (
													<CommandItem
														key={value}
														value={value}
														onSelect={() => {
															const newValue = isSelected
																? field.value.filter((v: string) => v !== value)
																: [...(field.value || []), value];

															field.onChange(newValue);
															onChange?.(newValue);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																isSelected ? "opacity-100" : "opacity-0"
															)}
														/>
														{label}
													</CommandItem>
												);
											})}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>

					{error?.message && <FormMessage>{error.message}</FormMessage>}
				</div>
			)}
		/>
	);
}
