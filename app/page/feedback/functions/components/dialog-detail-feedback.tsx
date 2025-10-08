import {
	useGetFeedbackReviewDetail,
	useGetFeedbackReviewPublish,
} from "@/api/feedback";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import DialogPublish from "@/components/custom/dialog/dialog-publish";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ClassValue } from "clsx";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

interface DialogDetailFeedbackProps {
	open: boolean;
	onClose: () => void;
	id: number;
	refetch: () => void;
}

const DialogDetailFeedback = ({
	open,
	onClose,
	id,
	refetch,
}: DialogDetailFeedbackProps) => {
	const [openPublish, setOpenPublish] = useState(false);
	const { data: dataDetail, refetch: refetchDetail } =
		useGetFeedbackReviewDetail(String(id) || "", {
			queryKey: ["feedbacks-review-get", id],
			enabled: !!id && open,
		});

	const { refetch: publish } = useGetFeedbackReviewPublish(String(id) || "", {
		queryKey: ["feedbacks-review-publish", id],
		enabled: false,
	});

	const TextFieldDisabled = ({
		title,
		value,
		className,
	}: {
		title?: string;
		value: string;
		className?: ClassValue;
	}) => {
		return (
			<div className="w-full">
				<div className="mb-1 font-medium">{title}</div>
				<div
					className={cn(
						"bg-[#F9F9F9] py-2 px-3 rounded-sm text-ellipsis overflow-hidden",
						className
					)}
				>
					{value}
				</div>
			</div>
		);
	};

	const grouped = Object.values(
		// @ts-ignore
		dataDetail?.response?.reduce(
			(acc, item) => {
				const key = `${item.form_type}-${item.id_question}`;

				if (!acc[key]) {
					acc[key] = {
						// root-level data
						id: dataDetail.id,
						tour_name: dataDetail.tour_name,
						participant_name: dataDetail.participant_name,
						is_publish: dataDetail.is_publish,

						// form/question level
						form_type: item.form_type,
						id_question: item.id_question,
						question_id: item.question_id,
						question_en: item.question_en,
						answers: [],
					};
				}

				acc[key].answers.push({
					id: item.id,
					answer_id: item.answer_id,
					answer_en: item.answer_en,
					value: item.value,
				});

				return acc;
			},
			{} as Record<
				string,
				{
					id: number;
					tour_name: string;
					participant_name: string;
					is_publish: number;
					form_type: string;
					id_question: number;
					question_id: string;
					question_en: string;
					answers: {
						id: number;
						answer_id: string;
						answer_en: string;
						value: string | null;
					}[];
				}
			>
		) || []
	);

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={"Review dari User"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div>
					<TextFieldDisabled
						title="Member Name"
						value={dataDetail?.participant_name || "-"}
						className={"mb-5"}
					/>

					{grouped.map((item, index) => {
						return (
							<div key={index} className="mb-3 border-1 p-4 rounded-md w-full">
								<div className="mb-1 font-medium">{item.question_en} (EN)</div>
								<div className="flex flex-row gap-5">
									{item.answers.map((answer, idx) => (
										<div className="flex flex-row gap-4 items-center" key={idx}>
											{item.form_type === "radio_button" ? (
												<Icon
													icon="ion:radio-button-on-outline"
													width="20"
													height="20"
												/>
											) : (
												item.form_type === "checkbox" && (
													<Icon
														icon="octicon:checkbox-16"
														width="20"
														height="20"
													/>
												)
											)}
											{(item.form_type === "radio_button" ||
												item.form_type === "checkbox") && (
												<div key={idx}>{answer.answer_en}</div>
											)}

											{item.form_type === "free_text" && (
												<TextFieldDisabled
													value={answer?.value || ""}
													className={"w-[300px] min-h-[80px]"}
												/>
											)}

											{item.form_type === "rating" && (
												<div className="flex mt-1">
													{Array.from({ length: 5 }, (_, i) => (
														<Icon
															key={i}
															icon={i < 5 ? "mdi:star" : "mdi:star-outline"}
															className="text-yellow-400 w-6 h-6"
														/>
													))}
												</div>
											)}
										</div>
									))}
								</div>

								<div className="mb-1 mt-2 font-medium w-full">
									{item.question_id} (ID)
								</div>
								<div className="flex flex-row gap-5 w-full">
									{item.answers.map((answer, idx) => (
										<div className="flex flex-row gap-4 items-center" key={idx}>
											{item.form_type === "radio_button" ? (
												<Icon
													icon="ion:radio-button-on-outline"
													width="20"
													height="20"
												/>
											) : (
												item.form_type === "checkbox" && (
													<Icon
														icon="octicon:checkbox-16"
														width="20"
														height="20"
													/>
												)
											)}
											{(item.form_type === "radio_button" ||
												item.form_type === "checkbox") && (
												<div key={idx}>{answer.answer_id}</div>
											)}

											{item.form_type === "free_text" && (
												<TextFieldDisabled
													value={answer?.value || ""}
													className={"w-[300px] min-h-[80px]"}
												/>
											)}

											{item.form_type === "rating" && (
												<div className="flex mt-1">
													{Array.from({ length: 5 }, (_, i) => (
														<Icon
															key={i}
															icon={i < 5 ? "mdi:star" : "mdi:star-outline"}
															className="text-yellow-400 w-6 h-6"
														/>
													))}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						);
					})}

					<div className="mt-3 flex flex-row justify-end">
						<Button
							className="w-[80px] bg-amber-500 hover:bg-amber-400 cursor-pointer"
							onClick={() => {
								setOpenPublish(true);
							}}
						>
							{dataDetail?.is_publish === 0 ? "Publish" : "Unpublish"}
						</Button>
					</div>

					<DialogPublish
						isPublish={dataDetail?.is_publish === 0}
						open={openPublish}
						onClose={() => {
							setOpenPublish(false);
						}}
						onSubmit={() => {
							publish().then(() => {
								refetch();
								refetchDetail();
								setOpenPublish(false);
								enqueueSnackbar({
									variant: "success",
									message: `Review berhasil ${dataDetail?.is_publish === 0 ? "diterbitkan" : "ditarik"} `,
								});
								onClose();
							});
						}}
					/>
				</div>
			}
		/>
	);
};

export default DialogDetailFeedback;
