import {
	useGetColumnRegistration,
	usePostExportRegistration,
	type ColumnVisitorType,
} from "@/api/report";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFCheckboxGroup from "@/components/RHForm/RHFCheckboxGroup";
import RHFDateRangePicker from "@/components/RHForm/RHFDateRangePicker";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/excel-download";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface DialogDownloadExcelRegistrationProps {
	open: boolean;
	onClose: () => void;
}

const DialogDownloadExcelRegistration = ({
	open,
	onClose,
}: DialogDownloadExcelRegistrationProps) => {
	const { data } = useGetColumnRegistration({
		enabled: open,
		queryKey: ["column-registration-all"],
	});
	const { mutate, isPending } = usePostExportRegistration();
	const methods = useForm({
		defaultValues: {
			dateRange: {
				from: "",
				to: "",
			},
			columns: [],
		},
	});

	const handleExport = async () => {
		const form = methods.getValues();

		const startDate = form.dateRange.from
			? format(new Date(form.dateRange.from), "yyyy-MM-dd")
			: "";
		const endDate = form.dateRange.to
			? format(new Date(form.dateRange.to), "yyyy-MM-dd")
			: "";

		mutate(
			{
				start_date: startDate,
				end_date: endDate,
				//@ts-ignore
				columns: form.columns.map((item) => item.value),
			},
			{
				onSuccess: (data) => {
					const filename = `registration_report_${startDate || "all"}_${endDate || "all"}.xlsx`;
					exportToExcel(data, filename);
					enqueueSnackbar({
						message: "File downloaded successfully ",
						variant: "success",
					});
				},
				onError: () => {
					enqueueSnackbar({ message: "File error ", variant: "error" });
				},
			}
		);
	};

	useEffect(() => {
		if (data?.data && open) {
			methods.reset({
				// @ts-ignore
				columns: data?.data || ([] as ColumnVisitorType[]),
				dateRange: {
					from: "",
					to: "",
				},
			});
		}
	}, [data, open]);

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				if (!isPending) {
					onClose();
					methods.reset();
				}
			}}
			headerTitle={"Export Report Registration"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div>
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={6}>
								<RHFDateRangePicker
									name="dateRange"
									placeholder="Start Date - End Date"
									label="Select the time range"
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFCheckboxGroup
									name="columns"
									label="Select the columns to export"
									options={data?.data || []}
									getOptionLabel={(item) => item.label}
									getOptionValue={(item) => item.value}
									direction="row"
									size="sm"
									className="text-xs gap-3"
								/>
							</Grid>

							<Grid item xs={12}>
								<div className="mt-3 flex flex-row justify-end">
									<Button
										disabled={isPending}
										onClick={() => {
											handleExport();
										}}
									>
										Export
									</Button>
								</div>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogDownloadExcelRegistration;
