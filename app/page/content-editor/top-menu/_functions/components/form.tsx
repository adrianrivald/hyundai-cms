import { DynamicBreadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Grid } from "@/components/grid";
import RHFTextField from "@/components/RHForm/RHFTextField";
import FormProvider from "@/components/RHForm/FormProvider";
import { QuillEditor } from "@/components/RHForm/RHFQuillEditor";

import { enqueueSnackbar } from "notistack";
import {
	usePostTopMenu,
	usePutTopMenu,
	type TopMenuTypePost,
	useGetTopMenu,
} from "@/api/top-menu";
import { TopMenuSchema } from "../models/top-menu";

const Form = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const methods = useForm({
		defaultValues: {
			title: "",
			content: "",
		},
		resolver: yupResolver(TopMenuSchema),
	});

	const { mutate: mutatePost, isPending: pendingPost } = usePostTopMenu();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutTopMenu();
	const { data: dataArticle } = useGetTopMenu(id || "", {
		enabled: !!id,
		queryKey: ["top-menu-get", id],
	});

	useEffect(() => {
		if (id) {
			methods.reset({
				title: dataArticle?.name || "",
				content: dataArticle?.content || "",
			});
		}
	}, [dataArticle, id]);

	const onSubmit = (status: string) => {
		const form = methods.watch();
		const postArticle: TopMenuTypePost = {
			status: status,
			content: form.content,
			name: form.title,
		};

		if (id) {
			mutateEdit(
				{ ...postArticle, id: Number(id) || 0 },
				{
					onSuccess: () => {
						methods.reset();
						navigate("/content-editor/top-menu");
						enqueueSnackbar("Data has been changed", { variant: "success" });
					},
					onError: () => {
						enqueueSnackbar("Error: Ubah artikel gagal", { variant: "error" });
					},
				}
			);
		} else {
			mutatePost(postArticle, {
				onSuccess: () => {
					methods.reset();
					navigate("/content-editor/top-menu");
					enqueueSnackbar("Data has been added", { variant: "success" });
				},
				onError: (err: any) => {
					enqueueSnackbar(`Error: ${err.response?.data?.message}`, {
						variant: "error",
					});
				},
			});
		}
	};

	return (
		<div>
			<div className="flex flex-row justify-between items-center">
				<DynamicBreadcrumb
					items={[
						{ label: "Home", href: "/" },
						{ label: "Top Menu", href: "/content-editor/article" },
						{ label: id ? "Edit Top Menu" : "Add Top Menu" },
					]}
				/>
				<div className="flex flex-row gap-2">
					<Button
						disabled={pendingEdit || pendingPost}
						variant="hmmiOutline"
						className="bg-transparent w-[100px]"
						onClick={() => {
							methods.trigger().then((isValid) => {
								if (isValid) {
									onSubmit("draft");
								}
							});
						}}
					>
						Draft
					</Button>

					<Button
						disabled={pendingEdit || pendingPost}
						className="w-[100px] bg-amber-500"
						onClick={() => {
							methods.trigger().then((isValid) => {
								if (isValid) {
									onSubmit("published");
								}
							});
						}}
					>
						Publish
					</Button>
				</div>
			</div>
			<FormProvider methods={methods}>
				<div className="mt-3 bg-white grid grid-cols-1 p-5">
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<RHFTextField
								name="title"
								label="Title"
								placeholder="Input title"
								required
								maxLength={200}
							/>
						</Grid>
					</Grid>
				</div>
				<div className="mt-5 p-3 bg-white">
					<Grid container spacing={4}>
						<Grid item xs={12}>
							<QuillEditor
								name="content"
								control={methods.control}
								placeholder={"Input content"}
								maxWords={1000}
							/>
						</Grid>
					</Grid>
				</div>
			</FormProvider>
		</div>
	);
};

export default Form;
