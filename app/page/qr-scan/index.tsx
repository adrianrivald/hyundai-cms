import { Typography } from "@/components/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function QRScan() {
	return (
		<div className="flex justify-center min-h-screen bg-black">
			<div
				className="relative w-full max-w-[768px] flex flex-col"
				style={{
					background: "linear-gradient(to bottom, #153263, #00102B)",
				}}
			>
				{/* Sticky Header */}
				<div className="sticky z-20 top-0 left-0 right-0 flex justify-between px-7 py-3 gap-2 bg-opacity-50 backdrop-blur-md bg-[#153263]">
					<div className="flex flex-row justify-between items-center w-full">
						<img
							src="/images/logo-hyundai.webp"
							height={23}
							width={51}
							className="object-contain"
						/>
						<div className="flex flex-row gap-3 items-center">
							<Typography className="text-sm font-bold text-white">
								Gilang
							</Typography>
							<img
								src="/images/people.webp"
								height={27}
								width={27}
								className="object-contain"
							/>
						</div>
					</div>
				</div>

				{/* Scrollable Main Content */}
				<div className="flex-1 overflow-auto">
					<ScrollArea className="h-full">
						<div className="p-6 text-white space-y-4">
							<Typography>Main Content</Typography>
							{/* Simulate more content */}
							{[...Array(5)].map((_, i) => (
								<div key={i}>
									<Typography>Item {i + 1}</Typography>
								</div>
							))}
						</div>
					</ScrollArea>
				</div>

				{/* Sticky Footer */}
				<div className="sticky bottom-0 left-0 right-0 flex justify-between px-7 py-4 gap-2 bg-opacity-50 backdrop-blur-md bg-[#091E41]">
					{[
						{ icon: "formkit:people", label: "Visitor List" },
						{ icon: "dinkie-icons:scan", label: "Scan Visitor" },
						{ icon: "mdi:register-outline", label: "New Regs" },
						{ icon: "mingcute:settings-2-line", label: "Settings" },
					].map(({ icon, label }) => (
						<div
							key={label}
							className="text-white flex flex-col items-center gap-2 cursor-pointer"
						>
							<Icon icon={icon} width="26" height="26" />
							<Typography className="text-xs">{label}</Typography>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
