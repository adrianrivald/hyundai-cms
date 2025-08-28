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
	const { control, setError } = useFormContext();
	const [preview, setPreview] = useState<string | null>("" ?? null);
	const [loading, setLoading] = useState(false);

	const uploadFile = async (
		file: File,
		onChange: (value: string | null) => void
	) => {
		try {
			setLoading(true);
			const formData = new FormData();
			formData.append("image", file);
			formData.append("slug", slug);

			const res = await fetch("https://hmmi-api.mkahfi.id/api/upload/image", {
				method: "POST",
				headers: {
					Authorization:
						"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaG1taS1hcGkubWthaGZpLmlkL2FwaS9hdXRoL2xvZ2luIiwiaWF0IjoxNzU2MzYzNTkwLCJleHAiOjE3NTYzNjcxOTAsIm5iZiI6MTc1NjM2MzU5MCwianRpIjoidTBqaGNFQXlER1FmWlpkRCIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.U3ZaHYBOongl8H9ctVACria8yiNNFqVqdEm-pAfq0z0",
				},
				body: formData,
			});
			if (!res.ok) throw new Error("Upload failed");
			const data = await res.json();

			setPreview(data.data.url);
			onChange(data.data.url);
		} catch (err) {
			console.error(err);
			setError(name, {
				type: "manual",
				message: "Gagal mengunggah gambar",
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
						message: "Ukuran maksimal 10MB untuk gambar",
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
							"h-[170px] w-full border-2 border-dashed rounded-lg flex justify-center items-center cursor-pointer transition hover:border-primary",
							className,
							error && "border-destructive"
						)}
						onDragOver={(e) => e.preventDefault()}
						// @ts-ignore
						onDrop={(e) => handleDrop(e, (f) => handleFileChange(f, onChange))}
					>
						<input
							type="file"
							accept="image/*"
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
									{loading ? "Uploading..." : "Ganti Gambar"}
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
										? "Mengunggah gambar..."
										: "Seret dan letakkan gambar, atau pilih dari file"}
								</Typography>
								<Typography className="px-[200px] text-center text-[10px] text-[#9A9A9A]">
									Gunakan gambar dengan lebar minimal 1600px. Ukuran maksimal
									10MB (20MB untuk video)
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
