"use client";

import { useCallback, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";

import {
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import "react-quill-new/dist/quill.snow.css";
import useToken from "@/hooks/use-token";

// ----------------------------------------------------------------------

const TOOLBAR_OPTIONS = [
	[{ header: [1, 2, 3, false] }],
	["bold", "italic", "underline", "strike"],
	[
		{ align: "" },
		{ align: "center" },
		{ align: "right" },
		{ align: "justify" },
	],
	[{ list: "ordered" }, { list: "bullet" }],
	["link", "image"],
	["undo", "redo"],
];

// Quill modules
export const modules = {
	toolbar: {
		container: TOOLBAR_OPTIONS,
		handlers: {
			undo: function () {
				const quill = (this as any).quill;
				quill.history.undo();
			},
			redo: function () {
				const quill = (this as any).quill;
				quill.history.redo();
			},
			image: function () {
				//@ts-ignore
				const handleImageUpload = (this.options.handlers as any)
					.handleImageUpload;
				if (handleImageUpload) handleImageUpload();
			},
		},
	},
	history: {
		delay: 500,
		maxStack: 100,

		userOnly: true,
	},
};

// ----------------------------------------------------------------------

type Props = {
	name: string;
	control: any;
	placeholder: string;
	maxWords?: number;
};

export function QuillEditor({
	name,
	control,
	placeholder = "Masukan konten",
	maxWords,
}: Props) {
	const quillRef = useRef<ReactQuill>(null);
	const token = useToken();

	const handleMaxWords = useCallback(() => {
		if (!quillRef.current || !maxWords) return;

		const quill = quillRef.current.getEditor();
		const text = quill.getText().trim();
		const words = text.split(/\s+/).filter(Boolean);

		if (words.length > maxWords) {
			const allowed = words.slice(0, maxWords).join(" ");

			// reset editor with allowed words only
			quill.setText(allowed + " ");
			quill.setSelection(allowed.length + 1);
		}
	}, [maxWords]);

	const uploadFile = async (file: File): Promise<string | null> => {
		try {
			const formData = new FormData();
			formData.append("image", file);
			formData.append("slug", "article");

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

			return data.data.url;
		} catch (err) {
			console.error("Image upload error:", err);
			return null;
		}
	};

	const handleImageUpload = useCallback(async () => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			const file = input.files?.[0];
			if (file) {
				const imageUrl = await uploadFile(file);
				if (!imageUrl) return;

				const quill = quillRef.current?.getEditor();
				const range = quill?.getSelection();

				if (quill && range) {
					quill.insertEmbed(range.index, "image", imageUrl);
					const img = quill.root.querySelector(`img[src="${imageUrl}"]`);
					if (img) {
						img.setAttribute(
							"style",
							"width:100%;height:100%;object-fit:cover;"
						);
					}
					//@ts-ignore
					quill.setSelection(range.index + 1);
				}
			}
		};
	}, []);

	const customModules = {
		...modules,
		toolbar: {
			...modules.toolbar,
			handlers: {
				...modules.toolbar.handlers,
				handleImageUpload,
			},
		},
	};

	return (
		<FormField
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<FormItem>
					<FormControl>
						<div
							className={cn(
								"rounded-lg border bg-gray-50 dark:bg-gray-900",
								fieldState.error && "border-red-500"
							)}
						>
							<ReactQuill
								ref={quillRef}
								value={field.value}
								onChange={field.onChange}
								onChangeSelection={() => {
									// hook into text-change via editor
									const editor = quillRef.current?.getEditor();
									if (editor) {
										editor.off("text-change", handleMaxWords); // prevent duplicate binding
										editor.on("text-change", handleMaxWords);
									}
								}}
								modules={customModules}
								formats={[
									"header",
									"font",
									"size",
									"bold",
									"italic",
									"underline",
									"align",
									"list",
									"bullet",
									"link",
									"image",
									"undo",
									"redo",
								]}
								placeholder={placeholder}
								className="min-h-[200px] max-h-[640px] [&_.ql-editor]:bg-gray-50 [&_.ql-editor]:p-2 [&_.ql-toolbar]:rounded-t-lg [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:max-h-[500px]"
							/>
						</div>
					</FormControl>
					{maxWords && (
						<p className="mt-1 text-xs text-gray-500">
							{quillRef.current
								?.getEditor()
								.getText()
								.trim()
								.split(/\s+/)
								.filter(Boolean).length ?? 0}{" "}
							/ {maxWords} words
						</p>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
