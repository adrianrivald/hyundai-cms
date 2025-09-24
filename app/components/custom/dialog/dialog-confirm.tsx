import DialogModal from "./dialog-modal";

interface DialogDeleteProps {
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
}

const DialogConfirm = ({ open, onClose, onSubmit }: DialogDeleteProps) => {
	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			title="Apakah anda yakin untuk keluar dari halaman ini ?"
			subtitle="Keputusan ini akan menghapus daftar yang sudah di isi, sehingga tidak dapat dikembalikan lagi."
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
