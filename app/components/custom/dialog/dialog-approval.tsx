import DialogModal from "./dialog-modal";

interface DialogDeleteProps {
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
	approval?: "Approve" | "Reject";
}

const DialogApproval = ({
	open,
	onClose,
	onSubmit,
	approval,
}: DialogDeleteProps) => {
	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			title={`Are you sure to ${approval} this ?`}
			subtitle="This decision is permanent, so it cannot be reversed"
			contentProps="w-[350px]"
			onClickLeft={() => {
				onSubmit();
			}}
			leftButtonTitle="Yes"
			rightButtonTitle="No"
			onClickRight={() => {
				onClose();
			}}
		/>
	);
};

export default DialogApproval;
