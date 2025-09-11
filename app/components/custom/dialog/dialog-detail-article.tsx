import type { ArticleType } from "@/api/article";
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
}

const DialogDetailArticle = ({
	data,
	open,
	onClose,
}: DialogDetailContentProps) => {
	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			//headerTitle={data?.name}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="mt-5">
					<div className="flex flex-row justify-between gap-1">
						<div>
							<Typography className="font-bold text-[40px]">
								{data.name}
							</Typography>
							<Typography className="text-xs">
								{data?.author} |{" "}
								{data?.published_at && isValid(new Date(data?.published_at))
									? format(data?.published_at, "dd MMMM yyyy")
									: "-"}{" "}
							</Typography>
						</div>
						<CellText
							color={data?.status == "draft" ? "red-500" : "white"}
							className={cn(
								"text-center rounded-sm font-bold text-sm px-2 h-[35px] max-h-[35px] min-h-[35px] min-w-[100px]",
								data?.status == "draft" &&
									"border-[1px] border-[#FF3B30] text-red-500",
								data?.status === "published" && "bg-[#00A30E]"
							)}
						>
							{data?.status === "draft" ? "Draft" : "Published"}
						</CellText>
					</div>
					<div className="max-h-[500px] overflow-y-scroll my-3">
						<div className="mt-3">
							<img
								src={data?.image_path || "-"}
								className="h-[300px] w-full object-cover"
							/>
						</div>
						<div
							dangerouslySetInnerHTML={{ __html: data?.blurb || "" }}
							className="mt-3"
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
