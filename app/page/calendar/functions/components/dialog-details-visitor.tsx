import type { ParticipantsType } from "@/api/tour";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react/dist/iconify.js";

interface DialogDetailsVisitorProps {
	open: boolean;
	onClose: () => void;
	data: ParticipantsType;
}

const DialogDetailsVisitor = ({
	open,
	onClose,
	data,
}: DialogDetailsVisitorProps) => {
	const TextFieldDisabled = ({
		title,
		value,
	}: {
		title: string;
		value: string;
	}) => {
		return (
			<>
				<div className="mb-1 font-medium">{title}</div>
				<div className=" py-2 rounded-sm text-ellipsis overflow-hidden">
					{value}
				</div>
			</>
		);
	};
	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={
				<div className="flex flex-row gap-2 items-center">
					<Typography className="font-bold">Visitor Profile</Typography>
					{data?.verified_at && (
						<div className="flex flex-row gap-2 items-center font-normal bg-green-600 px-3 py-1 rounded-sm text-[12px] text-white">
							<Icon icon="gg:check-o" width="16" height="16" /> Verified
						</div>
					)}
				</div>
			}
			contentProps="w-[750px] max-h-[750px]"
			content={
				<div>
					<Grid container spacing={2} className="mt-2">
						<Grid item xs={6}>
							<TextFieldDisabled title="Member Name" value={data?.name} />
						</Grid>
						<Grid item xs={6}>
							<TextFieldDisabled title="Email" value={data?.email} />
						</Grid>
						<Grid item xs={6}>
							<TextFieldDisabled
								title="Gender"
								value={data?.sex === "male" ? "Male" : "Female"}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextFieldDisabled
								title="Date of Birth"
								value={data?.dob || "-"}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextFieldDisabled
								title="Special Needs"
								value={data?.is_special_need ? "Yes" : "No"}
							/>
						</Grid>
					</Grid>
				</div>
			}
		/>
	);
};

export default DialogDetailsVisitor;
