import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Typography } from "@/components/typography";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "react-quill-new/dist/quill.snow.css";
import "./dialog.css";

interface DialogDetailContentProps {
	type: string;
	title: string;
	content: string;
	language: string;
	open: boolean;
	onClose: () => void;
}

const DialogDetailContent = ({
	type = "Legal",
	title,
	content,
	language,
	open,
	onClose,
}: DialogDetailContentProps) => {
	function normalizeLists(content: string) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(content, "text/html");

		const result: string[] = [];
		let currentListType: "ordered" | "bullet" | null = null;
		let buffer: string[] = [];
		let currentNumber = 1; // next number for ordered lists
		let nextStartNumber = 1; // used for <ol start="...">

		doc.body.childNodes.forEach((node) => {
			if (node.nodeName === "OL" || node.nodeName === "UL") {
				// Filter only LI elements and make TS happy
				const lis = Array.from(node.childNodes).filter(
					(li): li is HTMLElement =>
						li.nodeName === "LI" && li instanceof HTMLElement
				);

				lis.forEach((li) => {
					const dataList = li.getAttribute("data-list");

					// Detect list type change
					if (dataList === "ordered") {
						if (currentListType !== "ordered") {
							if (buffer.length) {
								if (currentListType === "bullet") {
									result.push(`<ul>${buffer.join("")}</ul>`);
								} else if (currentListType === "ordered") {
									result.push(
										`<ol start="${nextStartNumber}">${buffer.join("")}</ol>`
									);
								}
								buffer = [];
							}
							currentListType = "ordered";
							// Update start number for continuing ordered list
							nextStartNumber = currentNumber;
						}
					} else {
						if (currentListType !== "bullet") {
							if (buffer.length) {
								if (currentListType === "ordered") {
									result.push(
										`<ol start="${nextStartNumber}">${buffer.join("")}</ol>`
									);
								} else if (currentListType === "bullet") {
									result.push(`<ul>${buffer.join("")}</ul>`);
								}
								buffer = [];
							}
							currentListType = "bullet";
						}
					}

					buffer.push(li.outerHTML);

					// Increment currentNumber ONLY for ordered items
					if (dataList === "ordered") {
						currentNumber++;
					}
				});
			} else {
				if (buffer.length) {
					if (currentListType === "bullet") {
						result.push(`<ul>${buffer.join("")}</ul>`);
					} else if (currentListType === "ordered") {
						result.push(
							`<ol start="${nextStartNumber}">${buffer.join("")}</ol>`
						);
					}
					buffer = [];
					currentListType = null;
				}
				// Only add element nodes
				if (node instanceof HTMLElement) {
					result.push(node.outerHTML);
				} else if (node.nodeType === Node.TEXT_NODE) {
					result.push(node.textContent || "");
				}
			}
		});

		// Flush remaining buffer
		if (buffer.length) {
			if (currentListType === "bullet") {
				result.push(`<ul>${buffer.join("")}</ul>`);
			} else if (currentListType === "ordered") {
				result.push(`<ol start="${nextStartNumber}">${buffer.join("")}</ol>`);
			}
		}

		return result.join("");
	}

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={"View Details " + type}
			contentProps="w-[850px] max-h-[750px] overflow-y-scroll"
			content={
				<div>
					<Typography>
						Title : {title} ({language.toUpperCase()})
					</Typography>

					<div
						dangerouslySetInnerHTML={{ __html: normalizeLists(content) }}
						className="mt-3 prose prose-sm max-w-none ql-editor"
					></div>

					{/* <div className="mt-4" />
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[rehypeRaw]}
						components={{
							p: ({ node, ...props }) => (
								<p className="my-1 leading-relaxed text-gray-800" {...props} />
							),

							h2: ({ node, ...props }) => (
								<h2
									className="mt-6 mb-3 text-2xl font-semibold text-gray-800"
									{...props}
								/>
							),

							h1: ({ node, ...props }) => (
								<h1
									className="mt-6 mb-4 text-3xl font-bold text-gray-900"
									{...props}
								/>
							),
							ol: ({ node, ...props }) => (
								<ol
									className="list-decimal list-inside my-4 space-y-2"
									{...props}
								/>
							),
							ul: ({ node, ...props }) => (
								<ul
									className="list-disc list-inside my-4 space-y-2"
									{...props}
								/>
							),
						}}
					>
						{normalizeLists(content)}
					</ReactMarkdown> */}
				</div>
			}
		/>
	);
};

export default DialogDetailContent;
