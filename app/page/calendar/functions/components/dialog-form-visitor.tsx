import {
	usePostParticipantTourGroup,
	type ParticipantsType,
	usePutParticipantTourGroup,
	type ParticipantInputType,
} from "@/api/tour";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import RHFSelect from "@/components/RHForm/RHFSelect";
import RHFTextField from "@/components/RHForm/RHFTextField";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface DialogDetailsVisitorProps {
	open: boolean;
	onClose: () => void;
	data?: ParticipantsType;
	isDisabled?: boolean;
	tour_id?: string;
	refetch?: () => void;
}

const genderOptions = [
	{
		id: "male",
		name: "Male",
	},
	{
		id: "female",
		name: "Female",
	},
];

const difabelOptions = [
	{
		id: "true",
		name: "Yes",
	},
	{
		id: "false",
		name: "No",
	},
];

const DialogFormVisitor = ({
	open,
	onClose,
	data,
	tour_id,
	refetch,
}: DialogDetailsVisitorProps) => {
	const schema = yup.object({
		id: yup.string().optional().nullable(),
		name: yup.string().required("Name is required"),
		dob: yup.string().required("Date of birth is required"),
		sex: yup.string().required("Sex is required"),
		email: yup.string().email("Invalid email").required("Email is required"),
		phone_number: yup.string().required("Phone number is required"),
		is_special_need: yup
			.string()
			.required("Special need information is required"),
	});

	const methods = useForm({
		defaultValues: {
			id: "",
			name: "",
			dob: "",
			sex: "",
			email: "",
			phone_number: "",
			is_special_need: "",
		},
		mode: "onChange",
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (data && open) {
			methods.reset({
				id: String(data?.id),
				name: data?.name,
				dob: data?.dob,
				sex: data?.sex,
				email: data?.email,
				is_special_need: String(data?.is_special_need),
				phone_number: data?.phone_number,
			});
		}
	}, [data, open]);

	const { mutate: mutatePost, isPending: pendingPost } =
		usePostParticipantTourGroup(tour_id || "");
	const { mutate: mutateEdit, isPending: pendingEdit } =
		usePutParticipantTourGroup();

	const onSubmit = () => {
		const form = methods.watch();

		const dataForm: ParticipantInputType = {
			id: form?.id || "",
			name: form.name,
			dob: format(new Date(form.dob), "yyyy-MM-dd"),
			sex: form.sex,
			email: form.email,
			phone_number: form.phone_number,
			is_special_need: form.is_special_need === "true",
		};
		if (!tour_id) {
			mutateEdit(dataForm, {
				onSuccess: () => {
					onClose();
					methods.clearErrors();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data has been changed", {
						variant: "success",
					});
				},
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
						variant: "error",
					});
				},
			});
		} else {
			mutatePost(dataForm, {
				onSuccess: () => {
					onClose();
					methods.clearErrors();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data has been added", {
						variant: "success",
					});
				},
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
						variant: "error",
					});
				},
			});
		}
	};

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={
				<div className="flex flex-row gap-2 items-center">
					<Typography className="font-bold">
						{data?.id ? "Edit " : "Add "} Participant
					</Typography>
				</div>
			}
			contentProps="w-[750px] max-h-[750px]"
			content={
				<div>
					<FormProvider methods={methods}>
						<Grid container spacing={4} className="mt-2">
							<Grid item xs={6}>
								<RHFTextField
									name={`name`}
									label="Full Name"
									placeholder="Input Full Name"
									autoFocus={false}
									required
								/>
							</Grid>
							<Grid item xs={6}>
								<RHFTextField
									name={`phone_number`}
									label="Phone Number"
									placeholder="Input Phone Number"
									autoFocus={false}
									required
									type="number"
								/>
							</Grid>
							<Grid item xs={6}>
								<RHFTextField
									name={`email`}
									label="Email Address"
									placeholder="Input Email Address"
									autoFocus={false}
									required
								/>
							</Grid>
							<Grid item xs={6}>
								<RHFSelect
									name={`sex`}
									label="Gender"
									options={genderOptions}
									placeholder="Choose Gender"
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
								/>
							</Grid>

							<Grid item xs={6}>
								<RHFDatePicker
									name={`dob`}
									label="Birth Date"
									required
									placeholder="Select Birth Date"
									format="dd/MM/yyyy"
									onChange={(date) => {
										if (date) {
											methods.setValue(`dob`, date.toISOString());
										}
									}}
									maxDate={new Date()}
								/>
							</Grid>
							<Grid item xs={6}>
								<RHFSelect
									className="space-y-0"
									name={`is_special_need`}
									label="Any special needs? (Disability)"
									options={difabelOptions}
									placeholder="Choose"
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
								/>
							</Grid>
							<Grid item xs={12} className="flex flex-row justify-end">
								<Button
									onClick={() => {
										methods.trigger().then((isvalid) => {
											if (isvalid) {
												onSubmit();
											}
										});
									}}
								>
									Save
								</Button>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogFormVisitor;
