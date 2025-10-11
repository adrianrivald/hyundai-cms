import { usePostDashboardTour, type DashboardTourType } from "@/api/dashboard";
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
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useEffect, useMemo, useState } from "react";

import { useForm } from "react-hook-form";
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
	vip_tour: {
		label: "VIP Tour",
		color: "#93BCFF",
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
	const [dataTour, setDataTour] = useState({} as DashboardTourType);
	const methods = useForm({
		defaultValues: {
			start_date: startOfMonth(new Date()),
			end_date: endOfMonth(new Date()),
		},
	});

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
			value: 75,
			fill: "var(--color-general-tour)",
		},
		{
			name: "student_tour",
			value: 25,
			fill: "var(--color-student-tour)",
		},
		{
			name: "vip",
			value: 10,
			fill: "var(--color-press-shop)",
		},
	];

	//const dataPie = dataTour && dataTour?.tour_by_package_type?.

	const dataBar = dataTour?.tour_by_city
		? Object.entries(dataTour?.tour_by_city).map(([city, total]) => ({
				city,
				total,
			}))
		: [];

	const baseHeight = 300; // for 4 items
	const extraHeightPerBar = 50;
	const chartHeight =
		dataBar.length <= 4
			? baseHeight
			: baseHeight + (dataBar.length - 4) * extraHeightPerBar;

	const dataFavoritePie = [
		{
			name: "general_reception",
			value: 25,
			fill: "var(--color-general-tour)",
		},
		{
			name: "press_shop",
			value: 25,
			fill: "var(--color-press-shop)",
		},
		{
			name: "body_shop",
			value: 25,
			fill: "var(--color-body-shop)",
		},
		{
			name: "assembly_shop",
			value: 25,
			fill: "var(--color-assembly-shop)",
		},
	];

	return (
		<Container>
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
						Cari Data
					</Button>
				</div>
				<Grid container>
					<Grid item xs={12} className="bg-white mt-5 rounded-sm p-5">
						<ChartContainer
							config={chartConfig}
							className="h-[350px] w-full mt-5"
						>
							<LineChart
								accessibilityLayer
								data={chartData}
								margin={{
									left: 10,
									right: 55,
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
								<YAxis />
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Line
									dataKey="student-course"
									type="natural"
									stroke="var(--color-student-tour)"
									strokeWidth={2}
									dot={true}
									name={chartConfig.student_tour.label}
								/>
								<Line
									dataKey="general-course"
									type="natural"
									stroke="var(--color-general-tour)"
									strokeWidth={2}
									dot={true}
									name={chartConfig.general_tour.label}
								/>
								<Line
									dataKey="vip"
									type="natural"
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

				<Grid container spacing={3} className="mt-5 mb-10">
					<Grid item xs={6} className="bg-white rounded-sm pt-5">
						<Typography className="text-center font-bold">
							Total Visitor
						</Typography>
						<ChartContainer
							config={chartConfig}
							className="mx-auto aspect-square max-h-[250px]"
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
												{payload.value} %
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
							<Typography className="font-bold text-[18px]">
								Jenis Gender Pengunjung
							</Typography>
							<div className="mt-5 flex flex-row">
								<div className="flex-1">
									<Typography className="text-[#8E8E93]">Laki Laki</Typography>
									<Typography className="font-medium text-[18px]">
										{dataTour?.gender?.male || 0}
									</Typography>
								</div>
								<div className="flex-1">
									<Typography className="text-[#8E8E93]">Perempuan</Typography>
									<Typography className="font-medium text-[18px]">
										{dataTour?.gender?.female || 0}
									</Typography>
								</div>
							</div>
						</div>
					</Grid>

					<Grid item xs={12} className="bg-white rounded-sm pt-5">
						<Typography className="text-center mb-5 text-[18px] font-bold">
							Provinsi Asal
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

					<Grid item xs={6}>
						<div className="bg-white rounded-sm pt-5">
							<Typography className="text-center font-bold">
								Area Favorit
							</Typography>
							<ChartContainer
								config={chartConfig}
								className="mx-auto aspect-square max-h-[250px]"
							>
								<PieChart>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent hideLabel />}
									/>
									<Pie
										data={dataFavoritePie}
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
													{payload.value} %
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
						</div>
					</Grid>
					<Grid item xs={6}>
						<div className="bg-white rounded-sm pt-5 px-3 pb-3">
							<Typography className="font-bold ">Rating & Feedback</Typography>
							<div className="mt-5">
								<div className="flex items-start gap-4 w-full">
									<div className="flex flex-col items-center mt-5 px-5">
										<span className="text-4xl font-bold">4,5</span>
										<div className="flex mt-1">
											{[1, 2, 3, 4].map((i) => (
												<Icon
													key={i}
													icon="mdi:star"
													className="text-yellow-400 w-6 h-6"
												/>
											))}
											<Icon
												icon="mdi:star-outline"
												className="text-yellow-400 w-6 h-6"
											/>
										</div>
									</div>

									{/* Right Side: Progress bars */}
									<div className="flex flex-col gap-1 w-full">
										{[5, 4, 3, 2, 1].map((star) => (
											<div key={star} className="flex items-center gap-2">
												<span className="w-4 text-sm">{star}</span>
												<div className="flex-1 h-3 bg-gray-200 rounded">
													<div
														className={`h-3 rounded bg-orange-500`}
														style={{
															width:
																star === 5
																	? "80%"
																	: star === 4
																		? "65%"
																		: star === 3
																			? "45%"
																			: star === 2
																				? "20%"
																				: "15%",
														}}
													/>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
							{/* FEEDBACK */}
							<div className="mt-5">
								{[1, 2].map((item) => {
									return (
										<div
											className="p-3 bg-[#F7F7F7] rounded-sm mb-3"
											key={item}
										>
											<div className="flex flex-row gap-3 items-center">
												<img
													src="/images/example-image.webp"
													className="w-[50px] h-[50px] object-cover rounded-sm"
												/>
												<div>
													<Typography className="text-xs font-bold">
														Gilang Aditya R
													</Typography>
													<Typography className="text-xs">
														SMK Adijaya
													</Typography>
												</div>
											</div>

											<div className="flex flex-row mt-1">
												{[1, 2, 3, 4].map((i) => (
													<Icon
														key={i}
														icon="mdi:star"
														className="text-yellow-400 w-4 h-4"
													/>
												))}
												<Icon
													icon="mdi:star-outline"
													className="text-yellow-400 w-4 h-4"
												/>
											</div>

											<Typography className="text-xs text-[#383B46] mt-2">
												Pengalaman mengikuti course tour di Hyundai HMMI sangat
												bermanfaat bagi tim teknis kami. Kami belajar banyak
												tentang penerapan teknologi, keselamatan kerja, serta
												standar kualitas yang bisa diadaptasi di perusahaan
												kami.
											</Typography>
										</div>
									);
								})}

								<Button
									className="w-full cursor-pointer"
									variant={"hmmiOutline"}
								>
									Selengkapnya
								</Button>
							</div>
						</div>
					</Grid>
				</Grid>
			</FormProvider>
		</Container>
	);
}
