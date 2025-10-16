import fs from "fs";
import { parse, formatRgb } from "culori";

const cssFile = "./app/app.css"; // 👈 adjust to your actual path
let css = fs.readFileSync(cssFile, "utf8");

// Replace every oklch(...) with an rgb(...) equivalent
css = css.replace(/oklch\([^)]+\)/g, (match) => {
	try {
		const rgb = formatRgb(parse(match));
		return rgb; // replace directly with RGB
	} catch {
		return match; // keep original if parsing fails
	}
});

fs.writeFileSync(cssFile, css);
console.log("✅ Replaced all OKLCH colors with RGB");
