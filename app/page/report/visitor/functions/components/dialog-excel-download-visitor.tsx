import { useGetColumnVisitor } from "@/api/report";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFCheckboxGroup from "@/components/RHForm/RHFCheckboxGroup";
import RHFDateRangePicker from "@/components/RHForm/RHFDateRangePicker";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

interface DialogDownloadExcelVisitorProps {
	open: boolean;
	onClose: () => void;
}

const DialogDownloadExcelVisitor = ({
	open,
	onClose,
}: DialogDownloadExcelVisitorProps) => {
	const { data } = useGetColumnVisitor();
	const methods = useForm({
		defaultValues: {
			dateRange: {
				from: "",
				to: "",
			},
			columns: [],
		},
	});

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={"Export Report Visitor"}
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
									<Button>Export</Button>
								</div>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogDownloadExcelVisitor;
