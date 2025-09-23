import { useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormControl,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import useToken from "@/hooks/use-token";

interface RHFFileUploadProps {
	name: string;
	label?: string;
	required?: boolean;
	accept?: string;
	className?: string;
}

export function RHFFileUpload({
	name,
	label,
	required,
	accept,
	className,
}: RHFFileUploadProps) {
	const { control, setError, getValues } = useFormContext();
	const [fileName, setFileName] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const token = useToken();
	const inputRef = useRef<HTMLInputElement | null>(null);

	const triggerFileDialog = () => {
		inputRef.current?.click();
	};

	const uploadFile = async (
		file: File,
		onChange: (value: string | null) => void
	) => {
		try {
			setLoading(true);
			const formData = new FormData();
			formData.append("file", file);
			formData.append("slug", "visiting-letter");

			const res = await fetch(
				`${import.meta.env.VITE_APP_API_URL}upload/file`,
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + token,
					},
					body: formData,
				}
			);

			if (!res.ok) throw new Error("Upload failed");
			const data = await res.json();

			setFileName(file.name);
			onChange(data.data.url);
		} catch (err) {
			setError(name, {
				type: "manual",
				message: "Failed to upload file",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = useCallback(
		(file: File | null, onChange: (value: string | null) => void) => {
			if (file) {
				if (file.size > 10 * 1024 * 1024) {
					setError(name, {
						type: "manual",
						message: "Maximum size for file is 10MB",
					});
					return;
				}
				uploadFile(file, onChange);
			}
		},
		[name, token]
	);

	return (
		<FormField
			name={name}
			control={control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
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
						<div className="flex w-full rounded-md overflow-hidden border border-input">
							{/* Left side gray box */}
							<div
								className={cn(
									"flex-1 flex items-center px-3 py-3 bg-muted text-muted-foreground text-sm cursor-pointer text-ellipsis",
									fileName && "text-foreground"
								)}
								onClick={triggerFileDialog}
							>
								{fileName || "Upload file"}
							</div>

							{/* Right side button */}
							<Button
								type="button"
								onClick={triggerFileDialog}
								className="rounded-l-none bg-[#102C5D] hover:bg-[#0d2349] text-white cursor-pointer h-11"
							>
								{loading ? "Uploading..." : "Upload File"}
							</Button>

							{/* Hidden input */}
							<input
								ref={inputRef}
								type="file"
								accept={accept}
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0] ?? null;
									handleFileChange(file, onChange);
									e.target.value = "";
								}}
							/>
						</div>
					</FormControl>

					{error?.message && <FormMessage>{error.message}</FormMessage>}
				</FormItem>
			)}
		/>
	);
}
