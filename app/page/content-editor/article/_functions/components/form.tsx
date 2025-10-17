import { DynamicBreadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { ArticleContentSchema } from "../models/article";
import { useEffect, useState } from "react";
import useUser from "@/hooks/use-user";
import { Grid } from "@/components/grid";
import RHFTextField from "@/components/RHForm/RHFTextField";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFUploadFile from "@/components/RHForm/RHFUploadFile";
import { QuillEditor } from "@/components/RHForm/RHFQuillEditor";
import {
	usePostArticle,
	usePutArticle,
	type PostArticleType,
	useGetArticle,
} from "@/api/article";
import { enqueueSnackbar } from "notistack";
import DialogDetailArticle from "@/components/custom/dialog/dialog-detail-article";
import { Typography } from "@/components/typography";

const Form = () => {
	const { id } = useParams();
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const user = useUser();
	const methods = useForm({
		defaultValues: {
			title: "",
			title_en: "",
			author: "",
			image: "",
			content: "",
			content_en: "",
		},
		resolver: yupResolver(ArticleContentSchema),
	});

	const { mutate: mutatePost, isPending: pendingPost } = usePostArticle();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutArticle();
	const { data: dataArticle } = useGetArticle(id || "", {
		enabled: !!id,
		queryKey: ["article-get", id],
	});

	useEffect(() => {
		if (id) {
			methods.reset({
				title: dataArticle?.name || "",
				title_en: dataArticle?.name_en || "",
				content: dataArticle?.content || "",
				content_en: dataArticle?.content_en || "",
				image: dataArticle?.image_path || "",
				author: dataArticle?.author || "",
			});
		}
	}, [dataArticle, id]);

	// useEffect(() => {
	// 	if (!id) {
	// 		methods.setValue("author", user.name);
	// 	}
	// }, [id]);

	const onSubmit = (status: string) => {
		const form = methods.watch();
		const postArticle: PostArticleType = {
			author_name: form.author,
			name: form.title,
			name_en: form.title_en,
			content_en: form.content_en,
			content: form.content,
			image_path: form.image,
			status: status,
		};

		if (id) {
			mutateEdit(
				{ ...postArticle, id: Number(id) || 0 },
				{
					onSuccess: () => {
						methods.reset();
						navigate("/content-editor/article");
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
					navigate("/content-editor/article");
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
						{ label: "Articles", href: "/content-editor/article" },
						{ label: id ? "Edit Article" : "Add Article" },
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
						onClick={() => {
							setOpen(true);
						}}
						className="w-[100px]"
						disabled={!methods.formState.isValid}
					>
						Preview
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
								label="Title ID"
								placeholder="Input title article"
								required
								maxLength={200}
							/>
							<div className="mt-3" />
							<RHFTextField
								name="title_en"
								label="Title EN"
								placeholder="Input title article"
								required
								maxLength={200}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<RHFTextField
								name="author"
								label="Author"
								placeholder="Input author article"
								required
							/>
						</Grid>
						<Grid item xs={12}>
							<RHFUploadFile name="image" slug="article" required />
						</Grid>
					</Grid>
				</div>
				<div className="mt-5 p-3 bg-white">
					<Grid container spacing={4}>
						<Grid item xs={12}>
							<Typography className="font-bold text-xs mb-2">
								Content ID <span className="text-red-500">*</span>
							</Typography>
							<QuillEditor
								name="content"
								control={methods.control}
								placeholder={"Input content"}
								maxWords={1000}
							/>
						</Grid>
					</Grid>
				</div>
				<div className="mt-5 p-3 bg-white">
					<Grid container spacing={4}>
						<Grid item xs={12}>
							<Typography className="font-bold text-xs mb-2">
								Content EN <span className="text-red-500">*</span>
							</Typography>
							<QuillEditor
								name="content_en"
								control={methods.control}
								placeholder={"Input content"}
								maxWords={1000}
							/>
						</Grid>
					</Grid>
				</div>
			</FormProvider>
			<DialogDetailArticle
				open={open}
				onClose={() => setOpen(false)}
				data={{
					id: 0,
					name: methods.watch("title") || "",
					author: methods.watch("author") || "",
					published_at: "-",
					content: methods.watch("content") || "",
					blurb: methods.watch("content") || "",
					image_path: methods.watch("image"),
					name_en: methods.watch("title"),
					content_en: methods.watch("content_en"),
					blurb_en: methods.watch("content_en"),
				}}
				isPreview
			/>
		</div>
	);
};

export default Form;
