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
			title={`Apakah anda yakin untuk ${isPublish ? "menerbitkan" : "menarik"} review ini`}
			subtitle={`Keputusan ini akan ${isPublish ? "menampilkan" : "menarik"} ulasan berikut pada microsite.`}
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

export default DialogPublish;
