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

interface Props {
	name: string;
	label?: string;
	placeholder?: string;
	description?: string;
	className?: string;
	disabled?: boolean;
	required?: boolean;
	rows?: number;
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
	...other
}: Props) {
	const { control } = useFormContext();

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
						<Textarea
							placeholder={placeholder}
							className="resize-none"
							disabled={disabled}
							rows={rows}
							{...field}
							{...other}
						/>
					</FormControl>

					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
