"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react";
import {
	useCallback,
	useState,
	type DragEvent,
	type InputHTMLAttributes,
	useEffect,
} from "react";
import useToken from "@/hooks/use-token";

interface RHFUploadFileProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
	required?: boolean;
	label?: string;
	className?: string;
	slug: "article" | "banner" | "factory";
}

export default function RHFUploadFile({
	name,
	required,
	label,
	className,
	slug,
	...other
}: RHFUploadFileProps) {
	const { control, setError, getValues } = useFormContext();
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const token = useToken();

	useEffect(() => {
		if (getValues(name)) {
			setPreview(getValues(name));
		}
	}, [getValues(name)]);

	const uploadFile = async (
		file: File,
		onChange: (value: string | null) => void
	) => {
		try {
			setLoading(true);
			const formData = new FormData();
			formData.append("image", file);
			formData.append("slug", slug);

			const res = await fetch(
				`${import.meta.env.VITE_APP_API_URL}upload/image`,
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

			setPreview(data.data.url);
			onChange(data.data.url);
		} catch (err) {
			setError(name, {
				type: "manual",
				message: "Failed to change image",
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
						message: "Maximum size for image is 10MB",
					});
					return;
				}
				uploadFile(file, onChange);
			}
		},
		[]
	);

	const handleDrop = (
		e: DragEvent<HTMLDivElement>,
		onChange: (value: string | null) => void
	) => {
		e.preventDefault();
		const file = e.dataTransfer.files?.[0];
		if (file) handleFileChange(file, onChange);
	};

	return (
		<FormField
			name={name}
			control={control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<div className="space-y-2">
					{label && (
						<FormLabel
							className={cn(
								required &&
									"after:content-['*'] after:ml-0.5 after:text-red-500",
								"text-[14px] font-medium text-hmmi-grey-900"
							)}
						>
							{label}
						</FormLabel>
					)}

					<div
						className={cn(
							"h-[150px] w-full border-2 border-dashed rounded-lg flex justify-center items-center cursor-pointer transition hover:border-primary",
							className,
							error && "border-destructive"
						)}
						onDragOver={(e) => e.preventDefault()}
						// @ts-ignore
						onDrop={(e) => handleDrop(e, onChange)}
					>
						<input
							type="file"
							accept="image/jpeg, image/png"
							hidden
							id={name}
							onChange={(e) => {
								const file = e.target.files?.[0] ?? null;
								handleFileChange(file, onChange);

								e.target.value = "";
							}}
							{...other}
						/>

						{preview ? (
							<div className="flex flex-col items-center">
								<img
									src={preview}
									alt="Preview"
									className="object-cover rounded-lg w-[200px] h-[80px]"
								/>
								<Typography className="text-[12px] mt-1 text-center text-[#9A9A9A] truncate max-w-[200px]">
									{typeof value === "string"
										? value.split("/").pop()
										: "Image.jpeg"}
								</Typography>
								<label
									htmlFor={name}
									className="text-[12px] underline mt-2 text-center cursor-pointer"
								>
									{loading ? "Uploading..." : "Change image"}
								</label>
							</div>
						) : (
							<label
								htmlFor={name}
								className="flex flex-col items-center gap-1"
							>
								<Icon icon="mynaui:image" height={28} width={28} />
								<Typography className="text-sm font-medium text-[#383B46]">
									{loading
										? "Uploading image..."
										: "Drag and drop an image, or select from file"}
								</Typography>
								<Typography className="px-[100px] md:px-[200px] text-center text-[10px] text-[#9A9A9A]">
									Use an image with a minimum width of 1600px. Maximum size is
									10MB (20MB for videos).
								</Typography>
							</label>
						)}
					</div>

					{error?.message && <FormMessage>{error.message}</FormMessage>}
				</div>
			)}
		/>
	);
}
