import DialogModal from "./dialog-modal";

interface DialogDeleteProps {
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
}

const DialogDelete = ({ open, onClose, onSubmit }: DialogDeleteProps) => {
	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			title="Are you sure you want to delete this list?"
			subtitle="This action will permanently remove the list from the system and cannot be undone."
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

export default DialogDelete;
