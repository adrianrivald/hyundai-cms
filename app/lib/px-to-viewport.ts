export function pxToVw(px: number, windowWidth?: number): string {
	if (typeof window !== "undefined") {
		const width = windowWidth ?? window.innerWidth;
		return `${(px / width) * 100}vw`;
	}
	return `${px}px`;
}

export function pxToVh(px: number, windowHeight?: number): string {
	if (typeof window !== "undefined") {
		const height = windowHeight ?? window.innerHeight;
		return `${(px / height) * 100}vh`;
	}
	return `${px}px`;
}
