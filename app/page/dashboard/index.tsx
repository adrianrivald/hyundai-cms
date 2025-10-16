import { usePostDashboardTour, type DashboardTourType } from "@/api/dashboard";
import { useGetFeedbackDashboard } from "@/api/feedback";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import Container from "@/components/container";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
	ChartLegendContent,
	ChartLegend,
} from "@/components/ui/chart";
import { useDebounce } from "@/hooks/use-debounce";
import { Icon } from "@iconify/react/dist/iconify.js";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
	CartesianGrid,
	XAxis,
	Line,
	LineChart,
	Legend,
	YAxis,
	Pie,
	PieChart,
	Bar,
	BarChart,
	LabelList,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { parse, formatRgb } from "culori";
import { LoadingIndicator } from "@/components/loading-indicator";

const chartConfig = {
	tour: {
		label: "Total Visitors",
	},
	student_tour: {
		label: "Student Tour",
		color: "#FFCA8B",
	},
	general_tour: {
		label: "General Tour",
		color: "#743F00",
	},
	vip: {
		label: "VIP Tour",
		color: "#93BCFF",
	},
	vip_tour: {
		label: "VIP Tour",
		color: "#93BCFF",
	},

	male: {
		label: "Male",
		color: "#6277DF",
	},
	female: {
		label: "Female",
		color: "#E62D2D",
	},

	general_reception: {
		label: "General Reception",
	},
	body_shop: {
		label: "Body Shop",
	},
	press_shop: {
		label: "Press Shop",
	},
	assembly_shop: {
		label: "Assembly Shop",
	},

	total: {
		label: "Total",
	},
	label: {
		color: "var(--background)",
	},
} satisfies ChartConfig;

export default function DashboardPage() {
	const navigate = useNavigate();
	const [dataTour, setDataTour] = useState({} as DashboardTourType);
	const [loading, setLoading] = useState(false);
	const methods = useForm({
		defaultValues: {
			start_date: startOfMonth(new Date()),
			end_date: endOfMonth(new Date()),
		},
	});

	const lineChartRef = useRef<HTMLDivElement>(null);
	const pieChartRef = useRef<HTMLDivElement>(null);
	const barChartRef = useRef<HTMLDivElement>(null);

	const startDate = methods.watch("start_date");
	const endDate = methods.watch("end_date");

	const debounceStartDate = useDebounce(startDate, 500);
	const debounceEndDate = useDebounce(endDate, 500);

	const start_date = useMemo(() => {
		if (!debounceStartDate) return "";
		try {
			return format(debounceStartDate, "yyyy-MM-dd");
		} catch {
			return "";
		}
	}, [debounceStartDate]);

	const end_date = useMemo(() => {
		if (!debounceEndDate) return "";
		try {
			return format(debounceEndDate, "yyyy-MM-dd");
		} catch {
			return "";
		}
	}, [debounceEndDate]);

	const { mutate } = usePostDashboardTour();
	const { data, refetch } = useGetFeedbackDashboard(start_date, end_date, {
		enabled: false,
		queryKey: ["feedback-dashboard-get-all"],
	});

	useEffect(() => {
		mutate(
			{
				start_date: start_date,
				end_date: end_date,
			},
			{
				onSuccess: (data) => {
					setDataTour(data.data);
				},
			}
		);
		refetch();
	}, [end_date, start_date]);

	const chartData =
		dataTour?.registration_by_date && dataTour?.registration_by_date?.length > 0
			? dataTour?.registration_by_date?.map((item) => ({
					date: format(new Date(item.date), "dd MMM yyyy"),
					vip: item.count.vip,
					["general-course"]: item.count["general-course"],
					["student-course"]: item.count["student-course"],
				}))
			: [];

	const dataPie = [
		{
			name: "general_tour",
			value: dataTour?.visitor_by_package_type?.["general-course"],
			fill: "var(--color-general-tour)",
		},
		{
			name: "student_tour",
			value: dataTour?.visitor_by_package_type?.["student-course"],
			fill: "var(--color-student-tour)",
		},
		{
			name: "vip",
			value: dataTour?.visitor_by_package_type?.vip,
			fill: "var(--color-press-shop)",
		},
	];

	//const dataPie = dataTour && dataTour?.tour_by_package_type?.

	const dataBar = dataTour?.tour_by_province
		? Object.entries(dataTour?.tour_by_province).map(([city, total]) => ({
				city: city.replace(/([a-z])([A-Z])/g, "$1 $2"),
				total,
			}))
		: [];

	const baseHeight = 300; // for 4 items
	const extraHeightPerBar = 50;
	const chartHeight =
		dataBar.length <= 4
			? baseHeight
			: baseHeight + (dataBar.length - 4) * extraHeightPerBar;

	const maxCount = Math.max(...Object.values(data?.data?.rating_count || 0));

	const handleExportChartsPDF = async () => {
		setLoading(true);
		const charts = [lineChartRef, pieChartRef, barChartRef];
		const pdf = new jsPDF("p", "pt", "a4");

		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();
		let currentY = 15;

		// --- Convert OKLCH colors to RGB temporarily ---
		const root = document.documentElement;
		const styles = getComputedStyle(root);
		const changedVars: Record<string, string> = {};

		for (const prop of styles) {
			const val = styles.getPropertyValue(prop);
			if (val.includes("oklch(")) {
				try {
					const rgb = formatRgb(parse(val));
					if (rgb) {
						changedVars[prop] = val; // store original
						root.style.setProperty(prop, rgb); // apply fallback
					}
				} catch {
					/* ignore */
				}
			}
		}

		try {
			for (let i = 0; i < charts.length; i++) {
				const chartRef = charts[i];
				if (!chartRef.current) continue;

				// Capture chart as image
				const canvas = await html2canvas(chartRef.current, {
					scale: 1.5,
					useCORS: true,
					backgroundColor: "#ffffff",
				});
				const imgData = canvas.toDataURL("image/jpeg");

				const imgWidth = pageWidth - 40;
				const imgHeight = (canvas.height * imgWidth) / canvas.width;

				// Add page if needed
				if (currentY + imgHeight > pageHeight - 20) {
					pdf.addPage();
					currentY = 20;
				}

				pdf.addImage(imgData, "PNG", 20, currentY, imgWidth, imgHeight);
				currentY += imgHeight + 20;
			}
			setLoading(false);
			pdf.save(`dashboard_charts_${new Date().toISOString().slice(0, 10)}.pdf`);
		} finally {
			// --- Revert back to OKLCH colors after export ---
			for (const [prop, originalVal] of Object.entries(changedVars)) {
				root.style.setProperty(prop, originalVal);
			}
		}
	};

	const dataGender = [
		{
			name: "male",
			value: dataTour?.gender?.male,
			fill: "var(--color-male)",
		},
		{
			name: "female",
			value: dataTour?.gender?.female,
			fill: "var(--color-female)",
		},
	];

	return (
		<Container>
			{loading && <LoadingIndicator text="export PDF" />}
			<FormProvider methods={methods}>
				<div className="flex flex-row gap-5 bg-white p-5  items-end rounded-sm">
					<RHFDatePicker
						name="start_date"
						label="Start Date"
						required
						placeholder="Choose start date"
						format="dd/MM/yyyy"
						onChange={(date) => {
							if (date) {
								methods.setValue("start_date", date.toISOString());
								methods.clearErrors("start_date");
								methods.setValue("end_date", "");
							}
						}}
						className="w-full"
						//minDate={new Date()}
					/>
					<RHFDatePicker
						name="end_date"
						label="End Date"
						required
						placeholder="Choose end date"
						format="dd/MM/yyyy"
						onChange={(date) => {
							if (date) {
								methods.setValue("end_date", date.toISOString());
								methods.clearErrors("end_date");
							}
						}}
						className="w-full"
						minDate={new Date(methods.watch("start_date"))}
					/>
					<Button
						className="bg-amber-500 hover:bg-amber-600 cursor-pointer"
						endIcon={
							<Icon icon="simple-line-icons:magnifier" width="16" height="16" />
						}
					>
						Search Data
					</Button>
					<Button
						onClick={() => {
							handleExportChartsPDF();
						}}
					>
						Export PDF
					</Button>
				</div>
				<Grid container ref={lineChartRef}>
					<Grid item xs={12} className="bg-white mt-5 rounded-sm p-5">
						<ChartContainer
							config={chartConfig}
							className="h-[350px] w-full mt-5"
						>
							<LineChart
								//accessibilityLayer
								data={chartData}
								margin={{
									left: 10,
									right: 55,
									bottom: 0,
								}}
							>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="date"
									interval={0}
									tickLine={true}
									axisLine={true}
									tickMargin={8}
									tickFormatter={(value) => value}
								/>
								<YAxis domain={[1, (dataMax: any) => dataMax + 5]} />
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Line
									dataKey="student-course"
									type="linear"
									stroke="var(--color-student-tour)"
									strokeWidth={2}
									dot={true}
									name={chartConfig.student_tour.label}
								/>
								<Line
									dataKey="general-course"
									type="linear"
									stroke="var(--color-general-tour)"
									strokeWidth={2}
									dot={true}
									name={chartConfig.general_tour.label}
								/>
								<Line
									dataKey="vip"
									type="linear"
									stroke="var(--color-press-shop)"
									strokeWidth={2}
									dot={true}
									name={chartConfig.vip_tour.label}
								/>
								<Legend
									margin={{ top: 20 }}
									wrapperStyle={{ marginTop: 20, paddingTop: 10 }}
								/>
							</LineChart>
						</ChartContainer>
					</Grid>
				</Grid>

				<Grid container spacing={3} className="mt-5 mb-10" ref={pieChartRef}>
					<Grid item xs={6} className="bg-white rounded-sm pt-5">
						<Typography className="text-center font-bold">
							Total Visitor
						</Typography>
						<ChartContainer
							config={chartConfig}
							className="mx-auto aspect-square max-h-[280px]"
						>
							<PieChart>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Pie
									data={dataPie}
									dataKey="value"
									nameKey="name"
									innerRadius={60}
									label={({ payload, ...props }) => {
										return (
											<text
												cx={props.cx}
												cy={props.cy}
												x={props.x}
												y={props.y}
												textAnchor={props.textAnchor}
												dominantBaseline={props.dominantBaseline}
												fill="hsla(var(--foreground))"
											>
												{payload.value}
											</text>
										);
									}}
								/>
								<ChartLegend
									content={<ChartLegendContent nameKey="name" />}
									className="-translate-y-2 flex-wrap gap-2 *:justify-center "
								/>
							</PieChart>
						</ChartContainer>
					</Grid>
					<Grid item xs={6} className="">
						<div className="relative bg-white rounded-sm py-5 px-5">
							<Typography className="font-bold text-center text-[18px]">
								Visitor Gender Type
							</Typography>
							<ChartContainer
								config={chartConfig}
								className="mx-auto aspect-square max-h-[280px]"
							>
								<PieChart>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent hideLabel />}
									/>
									<Pie
										data={dataGender}
										dataKey="value"
										nameKey="name"
										innerRadius={1}
										label={({ payload, ...props }) => {
											return (
												<text
													cx={props.cx}
													cy={props.cy}
													x={props.x}
													y={props.y}
													textAnchor={props.textAnchor}
													dominantBaseline={props.dominantBaseline}
													fill="hsla(var(--foreground))"
												>
													{payload.value}
												</text>
											);
										}}
									/>
									<ChartLegend
										content={<ChartLegendContent nameKey="name" />}
										className="-translate-y-2 flex-wrap gap-2 *:justify-center "
									/>
								</PieChart>
							</ChartContainer>
							{/* <div className="mt-5 flex flex-row">
								<div className="flex-1">
									<Typography className="text-[#8E8E93]">Male</Typography>
									<Typography className="font-medium text-[18px]">
										{dataTour?.gender?.male || 0}
									</Typography>
								</div>
								<div className="flex-1">
									<Typography className="text-[#8E8E93]">Female</Typography>
									<Typography className="font-medium text-[18px]">
										{dataTour?.gender?.female || 0}
									</Typography>
								</div>
							</div> */}
						</div>
					</Grid>
					<Grid item xs={12} className="bg-white rounded-sm pt-5">
						<Typography className="text-center mb-5 text-[18px] font-bold">
							Province of Origin
						</Typography>
						<ChartContainer
							config={chartConfig}
							className="w-full"
							style={{ height: `${chartHeight}px` }}
						>
							<BarChart
								accessibilityLayer
								data={dataBar}
								layout="vertical"
								barSize={50}
								maxBarSize={50}
								barGap={10}
								barCategoryGap={0}
								margin={{
									left: 20,
									right: 20,
									bottom: 20,
								}}
							>
								<CartesianGrid horizontal={false} />
								<YAxis
									dataKey="city"
									type="category"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
									tickFormatter={(value) => value.slice(0, 3)}
									hide
								/>
								<XAxis
									dataKey="total"
									type="number"
									tickLine={false}
									axisLine={false}
									tickMargin={10}
									tickCount={5}
								/>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent indicator="line" />}
								/>
								<Bar
									dataKey="total"
									layout="vertical"
									fill="var(--color-hmmi-bar-chart)"
									radius={4}
								>
									<LabelList
										dataKey="city"
										position="insideLeft"
										offset={8}
										//className="fill-(--colo-chart-2)"
										className="fill-[white]"
										fontSize={12}
									/>
								</Bar>
							</BarChart>
						</ChartContainer>
					</Grid>
					<Grid item xs={12}>
						<div className="bg-white rounded-sm pt-5 px-3 pb-3">
							<Typography className="font-bold ">Rating & Feedback</Typography>
							<div className="mt-5">
								<div className="flex items-start gap-4 w-full">
									<div className="flex flex-col items-center mt-5 px-5">
										<span className="text-4xl font-bold">
											{data?.data?.rating_average}
										</span>
										<div className="flex mt-1">
											{[1, 2, 3, 4, 5].map((i) => (
												<Icon
													key={i}
													icon={
														i <= (data?.data?.rating_average || 0)
															? "mdi:star"
															: "mdi:star-outline"
													}
													className="text-yellow-400 w-6 h-6"
												/>
											))}
										</div>
									</div>

									{/* Right Side: Progress bars */}
									<div className="flex flex-col gap-2 w-full">
										{[5, 4, 3, 2, 1].map((star) => {
											//@ts-ignore
											const count = data?.data?.rating_count?.[star];
											const widthPercent =
												maxCount === 0 ? 0 : (count / maxCount) * 100;

											return (
												<div
													key={star}
													className="flex items-center gap-2 w-full"
												>
													{/* Star number */}
													<span className="w-4 text-sm font-semibold text-gray-800 text-right">
														{star}
													</span>

													{/* Bar container */}
													<div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
														<div
															className="h-4 bg-orange-500 rounded-full transition-all duration-300"
															style={{ width: `${widthPercent}%` }}
														/>
													</div>

													{/* Count number */}
													<span className="w-4 text-sm font-semibold text-gray-600 text-right">
														{count}
													</span>
												</div>
											);
										})}
									</div>
								</div>
							</div>
							{/* FEEDBACK */}
							<div className="mt-5">
								{data?.data?.feedbacks?.map((item, index) => {
									return (
										<div
											className="p-3 bg-[#F7F7F7] rounded-sm mb-3"
											key={index}
										>
											<div className="flex flex-row gap-3 items-center">
												<Icon
													icon="fluent:person-32-filled"
													width="50"
													height="50"
													className="border-[1px] border-black rounded-sm"
												/>
												<div>
													<Typography className="text-xs font-bold">
														{item?.participant?.name}
													</Typography>
													<Typography className="text-xs">
														{item?.tour?.name}
													</Typography>
												</div>
											</div>

											<div className="flex flex-row mt-1">
												{[1, 2, 3, 4, 5].map((i) => (
													<Icon
														key={i}
														icon={
															i <=
															Number(
																item?.responses?.[0]?.form_type === "rating"
																	? item?.responses?.[0]?.value
																	: 0
															)
																? "mdi:star"
																: "mdi:star-outline"
														}
														className="text-yellow-400 w-4 h-4"
													/>
												))}
											</div>

											<Typography className="text-xs text-[#383B46] mt-2">
												{item.responses?.[1].form_type === "free_text"
													? item?.responses?.[1]?.value
													: "-"}
											</Typography>
										</div>
									);
								})}
							</div>
						</div>
					</Grid>
				</Grid>
				<Button
					className="w-full cursor-pointer"
					variant={"hmmiOutline"}
					onClick={() => {
						navigate("/feedback");
					}}
				>
					More Details
				</Button>
			</FormProvider>
		</Container>
	);
}
