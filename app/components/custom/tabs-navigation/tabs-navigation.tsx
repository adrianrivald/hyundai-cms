import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

type Step = {
	key: string;
	label: string;
};

interface StepNavigationProps {
	steps: Step[];
	value: string; // current step
	onChange: (key: string) => void; // triggered when user clicks
	activeColor?: string;
	inactiveColor?: string;
}

export function StepNavigation({
	steps,
	value,
	onChange,
	activeColor = "#153263",
	inactiveColor = "#A8C5F7",
}: StepNavigationProps) {
	return (
		<Grid container className="mb-5">
			{steps.map((step) => {
				const isActive = value === step.key;

				return (
					<Grid
						key={step.key}
						item
						xs={12 / steps.length}
						onClick={() => onChange(step.key)}
						className={cn(
							"py-4 px-5 cursor-pointer flex flex-row items-center gap-3",
							isActive ? `bg-[${activeColor}]` : `bg-[${inactiveColor}]`
						)}
					>
						<div className="min-[24px] max-[24px]">
							<Icon
								icon="fluent:checkmark-circle-24-filled"
								height={24}
								width={24}
								color={isActive ? "white" : activeColor}
							/>
						</div>

						<Typography className="text-white text-ellipsis line-clamp-1">
							{step.label}
						</Typography>
					</Grid>
				);
			})}
		</Grid>
	);
}
