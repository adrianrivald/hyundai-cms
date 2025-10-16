import { useGetTopMenu, type TopMenuTypePost } from "@/api/top-menu";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DialogDetailContentProps {
	data: TopMenuTypePost;
	open: boolean;
	onClose: () => void;
}

const DialogDetailTopMenu = ({
	data,
	open,
	onClose,
}: DialogDetailContentProps) => {
	const { data: dataArticle } = useGetTopMenu(String(data?.id) || "", {
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
							Close
						</Button>
					</div>
				</div>
			}
		/>
	);
};

export default DialogDetailTopMenu;
