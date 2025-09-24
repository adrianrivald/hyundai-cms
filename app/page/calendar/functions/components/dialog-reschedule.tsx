import DialogModal from "@/components/custom/dialog/dialog-modal";

interface DialogRescheduleProps {
	open: boolean;
	onClose: () => void;
}

const DialogReschedule = ({ open, onClose }: DialogRescheduleProps) => {
	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={""}
			contentProps="w-[70%] max-h-[90%]"
			content={<></>}
		/>
	);
};

export default DialogReschedule;
