import Container from "@/components/container";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DialogFeedback from "./components/dialog-feedback";

const FeedbackPage = () => {
	const [openFeedback, setOpenFeedback] = useState(false);

	return (
		<Container>
			<Typography>WIP</Typography>
			<Button
				onClick={() => {
					setOpenFeedback(true);
				}}
			>
				Create Feedback
			</Button>

			<DialogFeedback
				open={openFeedback}
				onClose={() => setOpenFeedback(false)}
			/>
		</Container>
	);
};

export default FeedbackPage;
