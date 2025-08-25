import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay = 500): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const previousValueRef = useRef<T>(value);

	useEffect(() => {
		if (value === previousValueRef.current) {
			return;
		}

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		previousValueRef.current = value;
		timeoutRef.current = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
