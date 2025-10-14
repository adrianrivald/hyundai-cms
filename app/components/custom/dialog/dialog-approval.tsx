import DialogModal from "./dialog-modal";

interface DialogDeleteProps {
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
	approval?: "Menyetujui" | "Menolak";
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
			title={`Apakah anda yakin untuk ${approval} ini ?`}
			subtitle="Keputusan ini bersifat permanen, sehingga tidak dapat dikembalikan lagi."
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

export default DialogApproval;
