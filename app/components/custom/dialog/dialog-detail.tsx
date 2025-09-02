import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Typography } from "@/components/typography";

interface DialogDetailContentProps {
	type: string;
	title: string;
	content: string;
	language: string;
	open: boolean;
	onClose: () => void;
}

const DialogDetailContent = ({
	type,
	title,
	content,
	language,
	open,
	onClose,
}: DialogDetailContentProps) => {
	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={"Lihat Detail " + type}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div>
					<Typography>
						Judul : {title} ({language.toUpperCase()})
					</Typography>
					<div
						dangerouslySetInnerHTML={{ __html: content }}
						className="mt-3"
					></div>
				</div>
			}
		/>
	);
};

export default DialogDetailContent;
