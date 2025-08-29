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
			title="Apakah anda yakin untuk menghapus daftar ini?"
			subtitle="Keputusan ini akan menghapus daftar secara permanen dari sistem, sehingga tidak dapat dikembalikan lagi."
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

export default DialogDelete;
