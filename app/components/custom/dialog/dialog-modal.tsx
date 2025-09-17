import Container from "@/components/container";
import { Stack } from "@/components/stack";
import { Typography } from "@/components/typography";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";

import type { ReactNode } from "react";
import { Label } from "recharts";

interface DialogModalProps {
	open: boolean;
	onOpenChange: () => void;
	contentProps?: string;
	headerTitle?: string | ReactNode;
	title?: string | ReactNode;
	subtitle?: string | ReactNode;
	image?: string | ReactNode;
	loading?: boolean;
	onClickLeft?: () => void;
	onClickRight?: () => void;
	leftButtonTitle?: string;
	rightButtonTitle?: string;
	leftButtonProps?: ButtonProps;
	rightButtonProps?: ButtonProps;
	textAlign?: "left" | "center" | "right";
	content?: ReactNode;
	imageClassName?: string;
	isLoading?: boolean;
	showCloseButton?: boolean;
	variantBtnLeft?:
		| "outline"
		| "link"
		| "default"
		| "destructive"
		| "info"
		| "secondary"
		| "ghost"
		| "success"
		| "hmmiPrimary"
		| "hmmiOutline"
		| "hmmiGhost"
		| null
		| undefined;
	variantBtnRight?:
		| "outline"
		| "link"
		| "default"
		| "destructive"
		| "info"
		| "secondary"
		| "ghost"
		| "success"
		| "hmmiPrimary"
		| "hmmiOutline"
		| "hmmiGhost"
		| null
		| undefined;
	overlayProps?: string;
}

const DialogModal = ({
	open,
	onOpenChange,
	contentProps,
	headerTitle,
	title,
	subtitle,
	loading,
	image,
	onClickLeft,
	onClickRight,
	leftButtonTitle,
	rightButtonTitle,
	textAlign = "center",
	content,
	variantBtnLeft = "hmmiPrimary",
	variantBtnRight = "hmmiOutline",
	leftButtonProps,
	rightButtonProps,
	imageClassName,
	isLoading,
	showCloseButton = true,
}: DialogModalProps) => {
	const alignText = `text-${textAlign}`;
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{showCloseButton && (
				<DialogClose className="hidden" onClick={onOpenChange} />
			)}
			<DialogOverlay />

			<DialogContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				className={cn("rounded-lg overflow-hidden w-[90%]", contentProps)}
				// onPointerDownOutside={(e) => e.preventDefault()}
				// onEscapeKeyDown={(e) => e.preventDefault()}
			>
				{headerTitle && (
					<DialogHeader>
						<DialogTitle className={`text-left text-[20px] font-bold `}>
							{headerTitle}
						</DialogTitle>
					</DialogHeader>
				)}

				{content ? (
					content
				) : (
					<Container className="flex justify-center flex-col">
						{typeof image === "string" ? (
							<img
								fetchPriority="high"
								src={image}
								alt="images"
								className={cn("bg-cover w-full h-[200px]", imageClassName)}
							/>
						) : (
							image
						)}

						<Typography
							className={` ${alignText} text-[16px] font-bold font-sans mt-[-20px]`}
						>
							{title}
						</Typography>
						<Typography
							className={`${alignText} text-sm font-sans text-[#6D717F]`}
						>
							{subtitle}
						</Typography>
					</Container>
				)}
				<Stack direction="row" className="gap-3">
					{onClickLeft && (
						<Button
							className="w-full"
							variant={variantBtnLeft}
							onClick={onClickLeft}
							{...leftButtonProps}
						>
							{leftButtonTitle}
						</Button>
					)}
					{onClickRight && (
						<Button
							className="w-full"
							variant={variantBtnRight}
							onClick={onClickRight}
							loading={loading}
							{...rightButtonProps}
							disabled={isLoading || rightButtonProps?.disabled || false}
						>
							{isLoading && (
								<Icon
									icon="line-md:loading-twotone-loop"
									width="28"
									height="28"
								/>
							)}
							{rightButtonTitle}
						</Button>
					)}
				</Stack>
			</DialogContent>
		</Dialog>
	);
};

export default DialogModal;
