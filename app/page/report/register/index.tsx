import Container from "@/components/container";
import { Typography } from "@/components/typography";
import { useForm } from "react-hook-form";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFDateRangePicker from "@/components/RHForm/RHFDateRangePicker";
import RHFTextField from "@/components/RHForm/RHFTextField";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { format } from "date-fns";
import DialogDownloadExcelRegistration from "./functions/components/dialog-excel-download-registration";
import { useReportRegistrationList } from "./functions/hooks/use-report-registration";
import { DataTable } from "@/components/layout/table/data-table";

const RegistrationReportPage = () => {
	const [open, setOpen] = useState(false);
	const methods = useForm({
		defaultValues: {
			search: "",
			dateRange: {
				from: undefined,
				to: undefined,
			},
		},
	});

	const { watch } = methods;

	const search = watch("search");
	const dateRange = watch("dateRange");

	const debouncedSearch = useDebounce(search, 500);
	const debouncedDateRange = useDebounce(dateRange, 500);

	const start_date = useMemo(() => {
		if (!debouncedDateRange?.from) return "";
		try {
			return format(debouncedDateRange.from, "yyyy-MM-dd");
		} catch {
			return "";
		}
	}, [debouncedDateRange?.from]);

	const end_date = useMemo(() => {
		if (!debouncedDateRange?.to) return "";
		try {
			return format(debouncedDateRange.to, "yyyy-MM-dd");
		} catch {
			return "";
		}
	}, [debouncedDateRange?.to]);

	const { table, metadata, fetchVisitor } = useReportRegistrationList(
		start_date,
		end_date,
		debouncedSearch
	);

	useEffect(() => {
		fetchVisitor?.();
	}, [debouncedSearch, start_date, end_date, fetchVisitor]);

	return (
		<Container>
			<FormProvider
				methods={methods}
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<div className="bg-white px-3 py-3 mb-4 flex flex-row justify-between items-center">
					<div>
						<Typography className="text-2xl font-bold">
							Registration Report
						</Typography>
					</div>
					<div className="flex flex-row gap-3">
						<RHFTextField
							name="search"
							placeholder="Search"
							endIcon={
								<Icon
									icon="lets-icons:search-light"
									width="26"
									height="26"
									className="mr-2"
								/>
							}
						/>
						<RHFDateRangePicker
							name="dateRange"
							placeholder="Start Date - End Date"
						/>
						<Button
							onClick={() => {
								setOpen(!open);
							}}
							className="bg-[#F2F2F7] text-black hover:bg-slate-200 cursor-pointer"
							startIcon={
								<Icon
									icon="vscode-icons:file-type-excel"
									width="28"
									height="28"
								/>
							}
						>
							Export
						</Button>
					</div>
				</div>
			</FormProvider>

			<DataTable table={table} showPagination={true} pagination={metadata} />

			<DialogDownloadExcelRegistration
				open={open}
				onClose={() => {
					setOpen(false);
				}}
			/>
		</Container>
	);
};

export default RegistrationReportPage;
