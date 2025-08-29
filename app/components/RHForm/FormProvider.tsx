import type { FormEventHandler, ReactNode } from "react";
import { FormProvider as Form, type UseFormReturn } from "react-hook-form";

type Props = {
	children: ReactNode;

	methods: UseFormReturn<any>;
	onSubmit?: FormEventHandler<HTMLFormElement>;
};

export default function FormProvider({ children, onSubmit, methods }: Props) {
	return (
		<Form {...methods}>
			<form onSubmit={onSubmit}>{children}</form>
		</Form>
	);
}
