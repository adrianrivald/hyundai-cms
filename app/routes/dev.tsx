import FormProvider from "@/components/RHForm/FormProvider";
import RHFAutocomplete from "@/components/RHForm/RHFAutocomplete";
import RHFCheckbox from "@/components/RHForm/RHFCheckbox";
import RHFCheckboxGroup from "@/components/RHForm/RHFCheckboxGroup";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import RHFDateRangePicker from "@/components/RHForm/RHFDateRangePicker";
import RHFRadioGroup from "@/components/RHForm/RHFRadioGroup";
import RHFSelect from "@/components/RHForm/RHFSelect";
import RHFSelectMultiple from "@/components/RHForm/RHFSelectMultiple";
import RHFSwitch from "@/components/RHForm/RHFSwitch";
import RHFTextArea from "@/components/RHForm/RHFTextArea";
import RHFTextField from "@/components/RHForm/RHFTextField";
import Container from "@/components/container";
import { Grid } from "@/components/grid";
import { Iconify } from "@/components/iconify";
import { Stack } from "@/components/stack";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useInfiniteQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

import { type DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";

export interface Comment {
	postId: number;
	id: number;
	name: string;
	email: string;
	body: string;
}

const DevPage = () => {
	const form1 = useForm<{
		formText: string;
		formNumber: string;
		user: string;
		fruit: string;
		comment: string;
		commentObj: {
			commentName: string;
			commentBody: string;
		};
		isActive: boolean;
		termsAccepted: boolean;
		description: string;
		birthDate: Date | null;
		skills: string[];
	}>({
		defaultValues: {
			formText: "",
			formNumber: "",
			comment: "",
			user: "",
			fruit: "",
			commentObj: {
				commentName: "",
				commentBody: "",
			},
			isActive: false,
			termsAccepted: false,
			description: "",
			birthDate: null,
			skills: [],
		},
	});
	const form2 = useForm<{
		formText: string;
		formNumber: string;
		hobbies: string[];
		skills: string[];
		dateRange: DateRange | undefined;
	}>({
		defaultValues: {},
	});

	const [searchTerm, setSearchTerm] = useState("");

	const fetchComments = async ({ pageParam = 1, searchTerm = "" }) => {
		const response = await fetch(
			`https://jsonplaceholder.typicode.com/comments?_page=${pageParam}&_limit=10&q=${searchTerm}`
		);
		return response.json();
	};

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useInfiniteQuery({
			queryKey: ["comments", searchTerm],
			queryFn: ({ pageParam }) => fetchComments({ pageParam, searchTerm }), // Use pageParam from query function
			getNextPageParam: (lastPage, allPages) => {
				return lastPage.length === 10 ? allPages.length + 1 : undefined;
			},
			initialPageParam: 1,
		});

	const allComments = data?.pages.flat() ?? [];

	const openSnackbar = () => {
		// enqueueSnackbar("This is a snackbar!", {
		// 	variant: "default",
		// });
		enqueueSnackbar("This is a snackbar!", {
			variant: "error",
		});
		// enqueueSnackbar("This is a snackbar!", {
		// 	variant: "success",
		// });
		// enqueueSnackbar("This is a snackbar!", {
		// 	variant: "info",
		// });
	};

	return (
		<Container>
			<ScrollArea>
				{/* <Dev /> */}

				<Container className="bg-blue-400 mt-[20px]">
					<Iconify icon="ic:baseline-home" width={30} height={30} />
					<Iconify icon="ic:baseline-home" width={30} height={30} />
					<Iconify icon="material-symbols:10k" width="24" height="24" />
					<Button
						onClick={() => {
							openSnackbar();
						}}
						title="Open Snackbar"
					>
						Open Snackbar
					</Button>

					<Grid container spacing={4}>
						<Grid item xs={12} sm={6} md={4} className="bg-yellow-100">
							<div className="p-4">Item 1</div>
						</Grid>
						<Grid item xs={6} sm={6} md={4} className="bg-gray-400">
							<div className="p-4">Item 2</div>
						</Grid>
						<Grid item xs={12} sm={6} md={5} className="bg-red-100">
							<div className="p-4">Item 3</div>
						</Grid>
					</Grid>
					<div className="grid grid-cols-12 ">
						<div className="md:col-span-4 bg-yellow-400">hehe</div>
						<div className="col-span-7 bg-red-200">hehe</div>
						<div className="col-span-12 bg-blue-400">hehe</div>
					</div>

					<Stack spacing={2}>
						<div>Item 1</div>
						<div>Item 2</div>
						<div>Item 3</div>
					</Stack>

					<Stack direction="row" spacing={10} alignItems="center">
						<div className="text-hmmi-primary-900">Item 2 change</div>
						<div>Item 2</div>
						<div>Item 3</div>
					</Stack>

					<Stack spacing={5}>
						<div>Item 1</div>
						<div>Item 2</div>
						<div>Item 3</div>
					</Stack>
				</Container>

				<Button
					onClick={() => {
						//setOpen(true)
					}}
					title="Open Snackbar"
				>
					Open Dialog
				</Button>
				<Container>
					<Grid container spacing={4}>
						<Grid item sm={6} className="border-2 p-2 items-center rounded-sm">
							<FormProvider methods={form1}>
								<RHFTextField
									name="formText"
									label="Form Text"
									required
									placeholder="Masukan alamat email"
								/>
								<RHFTextField
									name="formNumber"
									label="Form Number"
									required
									type="number"
								/>
								<RHFTextArea
									name="description"
									label="Description"
									placeholder="Enter your description here..."
									description="Maximum 500 characters"
									required
									rows={4}
								/>

								<RHFDatePicker
									name="birthDate"
									label="Birth Date"
									required
									placeholder="Select your birth date"
									format="dd/MM/yyyy"
									onChange={(date) => {
										form1.setValue("birthDate", date);
									}}
								/>

								<RHFAutocomplete
									name="commentObj.commentName"
									label="Select Comment With Object"
									options={allComments}
									getOptionLabel={(comment: Comment) => comment.name}
									getOptionValue={(comment: Comment) => String(comment.name)}
									loading={isLoading || isFetchingNextPage}
									onScrollEnd={() => {
										if (hasNextPage && !isFetchingNextPage) {
											fetchNextPage();
										}
									}}
									onSearch={(value) => {
										setSearchTerm(value);
									}}
									required
									onChange={(selected) => {
										form1.setValue("commentObj", {
											commentName: selected?.name ?? "",
											commentBody: selected?.body ?? "",
										});
									}}
								/>

								<RHFSelectMultiple
									name="skills"
									label="Programming Skills"
									options={[
										{ id: "1", name: "Javascript" },
										{ id: "2", name: "React" },
										{ id: "3", name: "Flutter" },
									]}
									getOptionLabel={(skill) => skill.name}
									getOptionValue={(skill) => skill.id}
									required
								/>

								<RHFCheckbox
									name="termsAccepted"
									label="I accept the terms and conditions"
									description="You must accept the terms to continue"
									onChange={(checked) => {
										form1.setValue("termsAccepted", checked);
									}}
								/>

								<RHFAutocomplete
									name="comment"
									label="Select Comment"
									options={allComments}
									getOptionLabel={(comment: Comment) => comment.name}
									getOptionValue={(comment: Comment) => String(comment.body)}
									loading={isLoading || isFetchingNextPage}
									onScrollEnd={() => {
										if (hasNextPage && !isFetchingNextPage) {
											fetchNextPage();
										}
									}}
									onSearch={(value) => {
										setSearchTerm(value);
									}}
									required
									onChange={(selected) => {
										form1.setValue("comment", selected?.body ?? "");
									}}
								/>

								<RHFSelect
									name="user"
									label="Select User"
									options={[
										{ id: 1, name: "hehe" },
										{ id: 2, name: "hehe2" },
										{ id: 3, name: "hehe3" },
										{ id: 4, name: "hehe3" },
										{ id: 5, name: "hehe3" },
										{ id: 6, name: "hehe3" },
										{ id: 7, name: "hehe3" },
										{ id: 8, name: "hehe3" },
										{ id: 9, name: "hehe3" },
										{ id: 10, name: "hehe3" },
										{ id: 11, name: "hehe3" },
										{ id: 12, name: "hehe3" },
										{ id: 13, name: "hehe3" },
										{ id: 14, name: "hehe3" },
										{ id: 15, name: "hehe3" },
										{ id: 16, name: "hehe3" },
									]}
									placeholder="Select User"
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
								/>

								<RHFAutocomplete
									name="user"
									label="Select User"
									options={[
										{ id: 1, name: "hehe" },
										{ id: 2, name: "hehe2" },
										{ id: 3, name: "hehe3" },
										{ id: 4, name: "hehe3" },
										{ id: 5, name: "hehe3" },
										{ id: 6, name: "hehe3" },
										{ id: 7, name: "hehe3" },
										{ id: 8, name: "hehe3" },
										{ id: 9, name: "hehe3" },
										{ id: 10, name: "hehe3" },
										{ id: 11, name: "hehe3" },
										{ id: 12, name: "hehe3" },
										{ id: 13, name: "hehe3" },
										{ id: 14, name: "hehe3" },
										{ id: 15, name: "hehe3" },
										{ id: 16, name: "hehe3" },
									]}
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
								/>

								<Stack direction="row" className="mt-5">
									<Button variant={"outline"} className="w-full">
										Cancel
									</Button>
									<Button type="submit" className="w-full">
										Submit
									</Button>
								</Stack>
							</FormProvider>
						</Grid>
						<Grid item sm={6} className="border-2 p-2 items-center rounded-sm">
							<FormProvider methods={form2}>
								<RHFTextField name="formText" label="Form Text" />
								<RHFTextField name="formNumber" label="Form Number" />
								<RHFSwitch
									name="isActive"
									label="Active Status"
									onChange={(checked) => {
										form1.setValue("isActive", checked);
									}}
								/>
								<RHFCheckboxGroup
									name="hobbies"
									label="Select Your Hobbies"
									options={["Reading", "Gaming", "Cooking", "Traveling"]}
									direction="row"
									size="default"
									helperText="Choose one or more hobbies"
								/>

								<RHFDateRangePicker
									name="dateRange"
									label="Select Date Range"
									required
									placeholder="Select date range"
									format="dd/MM/yyyy"
									onChange={(dateRange) => {
										form2.setValue("dateRange", dateRange);
									}}
								/>

								{/* <RHFCheckboxGroup
                  name="skills"
                  label="Programming Skills"
                  options={['JavaScript', 'Python', 'Java', 'Go']}
                  values={['js', 'py', 'java', 'go']}
                  getOptionLabel={['JavaScript', 'Python', 'Java', 'Golang']}
                  direction="column"
                  size="sm"
                  className="mt-4"
                /> */}
								<RHFRadioGroup
									name="gender"
									label="Gender"
									options={["Male", "Female", "Other"]}
									direction="row"
									size="default"
									helperText="Please select your gender"
								/>
								<RHFRadioGroup
									name="status"
									label="Status"
									options={["Active", "Inactive", "Pending"]}
									values={["1", "0", "2"]}
									getOptionLabel={[
										"Active User",
										"Inactive User",
										"Pending User",
									]}
									direction="column"
									size="sm"
								/>
								<div className="text-hmmi-primary-100 font-bold text-2xl ">
									testing
								</div>
								<div className="text-[#1C4D27] font-bold text-2xl">testing</div>
								<Stack direction="row" className="mt-5">
									<Button variant={"outline"} className="w-full">
										Cancel
									</Button>
									<Button className="w-full">Submit</Button>
									<Button variant={"ghost"}>Submit</Button>
								</Stack>
							</FormProvider>
						</Grid>
					</Grid>
					<div className="flex-row gap-2 mx-2 my-2">
						<Button variant={"outline"} disabled>
							Submit
						</Button>
						<Button variant={"ghost"} disabled>
							Submit
						</Button>
						<Button variant={"default"} disabled>
							Submit
						</Button>
					</div>
				</Container>
			</ScrollArea>
		</Container>
	);
};

export default DevPage;
