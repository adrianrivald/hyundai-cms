import DialogModal from "./dialog-modal";

interface DialogDeleteProps {
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
	isPublish: boolean;
}

const DialogPublish = ({
	open,
	onClose,
	onSubmit,
	isPublish,
}: DialogDeleteProps) => {
	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			title={`Are you sure you want to ${isPublish ? "publish" : "unpublish"} this review?`}
			subtitle={`This action will ${isPublish ? "display" : "remove"} the following review on the microsite.`}
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

export default DialogPublish;
