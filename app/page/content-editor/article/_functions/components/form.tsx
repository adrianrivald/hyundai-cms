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

const Form = () => {
	const { id } = useParams();
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const user = useUser();
	const methods = useForm({
		defaultValues: {
			title: "",
			author: "",
			image: "",
			content: "",
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
				content: dataArticle?.content || "",
				image: dataArticle?.image_path || "",
				author: dataArticle?.author || "",
			});
		}
	}, [dataArticle, id]);

	useEffect(() => {
		if (!id) {
			methods.setValue("author", user.name);
		}
	}, [id]);

	const onSubmit = (status: string) => {
		const form = methods.watch();
		const postArticle: PostArticleType = {
			name: form.title,
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
						enqueueSnackbar("Data telah diubah", { variant: "success" });
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
					enqueueSnackbar("Data telah ditambahkan", { variant: "success" });
				},
				onError: () => {
					enqueueSnackbar("Error: Pembuatan artikel gagal", {
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
						{ label: id ? "Edit Artikel" : "Tambah Artikel" },
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
								label="Judul"
								placeholder="Masukan judul artikel"
								required
								maxLength={80}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<RHFTextField
								name="author"
								label="Author"
								placeholder="Masukan Author Artikel"
								required
								disabled
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
							<QuillEditor
								name="content"
								control={methods.control}
								placeholder={"Masukan isi konten"}
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
				}}
				isPreview
			/>
		</div>
	);
};

export default Form;
