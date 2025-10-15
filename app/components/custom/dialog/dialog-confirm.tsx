import DialogModal from "./dialog-modal";

interface DialogDeleteProps {
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
	type?: string;
}

const DialogConfirm = ({ open, onClose, onSubmit }: DialogDeleteProps) => {
	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			title="Are you sure you want to leave this page?"
			subtitle="This action will delete the filled list and cannot be undone."
			contentProps="w-[350px]"
			onClickLeft={() => {
				onSubmit();
			}}
			leftButtonTitle="Ya"
			rightButtonTitle="Tidak"
			onClickRight={() => {
				onClose();
			}}
		/>
	);
};

export default DialogConfirm;
