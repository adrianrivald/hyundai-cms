import { useGetArticle, type ArticleType } from "@/api/article";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";

interface DialogDetailContentProps {
	data: ArticleType;
	open: boolean;
	onClose: () => void;
	isPreview?: boolean;
}

const DialogDetailArticle = ({
	data,
	open,
	onClose,
	isPreview,
}: DialogDetailContentProps) => {
	const { data: dataArticle } = useGetArticle(String(data?.id) || "", {
		enabled: !!data?.id && open,
		queryKey: ["article-get", data?.id],
	});

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			//headerTitle={dataArticle?.name}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="mt-5">
					<div className="flex flex-row justify-between gap-1">
						<div>
							<Typography className="font-bold text-[40px]">
								{dataArticle?.name || data?.name}
							</Typography>
							<Typography className="text-xs">
								{dataArticle?.author || data?.author} |{" "}
								{dataArticle?.published_at &&
								isValid(new Date(dataArticle?.published_at))
									? format(dataArticle?.published_at, "dd MMMM yyyy")
									: "-"}{" "}
							</Typography>
						</div>
						<CellText
							color={
								(dataArticle?.status || data?.status) == "draft"
									? "red-500"
									: "white"
							}
							className={cn(
								"text-center rounded-sm font-bold text-sm px-2 h-[35px] max-h-[35px] min-h-[35px] min-w-[100px]",
								(dataArticle?.status || data?.status) == "draft" &&
									"border-[1px] border-[#FF3B30] text-red-500",
								(dataArticle?.status || data?.status) === "published" &&
									"bg-[#00A30E]"
							)}
						>
							{(dataArticle?.status || data?.status) === "draft"
								? "Draft"
								: "Published"}
						</CellText>
					</div>
					<div className="max-h-[500px] overflow-y-scroll my-3">
						<div className="mt-3">
							<img
								src={dataArticle?.image_path || data?.image_path || "-"}
								className="h-[300px] w-full object-cover"
							/>
						</div>
						<div
							dangerouslySetInnerHTML={{
								__html: dataArticle?.content || data?.content || "",
							}}
							className="mt-3 article-content"
						/>
					</div>

					<div className="mt-3 flex flex-row justify-end">
						<Button
							onClick={() => {
								onClose();
							}}
							variant={"hmmiOutline"}
						>
							Tutup
						</Button>
					</div>
				</div>
			}
		/>
	);
};

export default DialogDetailArticle;
