export function applyOklchFallbackColors() {
	const root = document.documentElement;
	const vars = [
		"--background",
		"--foreground",
		"--card",
		"--primary",
		"--secondary",
		"--muted",
		"--accent",
		"--destructive",
		"--border",
		"--input",
		"--ring",
		"--chart-1",
		"--chart-2",
		"--chart-3",
		"--chart-4",
		"--chart-5",
	];

	// Store original values to restore later
	const originalValues = vars.map((v) => [v, root.style.getPropertyValue(v)]);

	// Replace OKLCH vars with safe RGB equivalents
	root.style.setProperty("--background", "rgb(255,255,255)");
	root.style.setProperty("--foreground", "rgb(0,0,0)");
	root.style.setProperty("--primary", "rgb(0,51,160)");
	root.style.setProperty("--secondary", "rgb(100,100,100)");
	root.style.setProperty("--muted", "rgb(220,220,220)");
	root.style.setProperty("--accent", "rgb(150,150,150)");
	root.style.setProperty("--destructive", "rgb(255,0,0)");
	root.style.setProperty("--chart-1", "#FFCA8B");
	root.style.setProperty("--chart-2", "#743F00");
	root.style.setProperty("--chart-3", "#93BCFF");
	root.style.setProperty("--chart-4", "#FF8B00");
	root.style.setProperty("--chart-5", "#153263");

	// Return a cleanup function to restore OKLCH colors
	return () => {
		for (const [v, val] of originalValues) {
			if (val) root.style.setProperty(v, val);
		}
	};
}
