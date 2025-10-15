import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel(data: any[], fileName = "report.xlsx") {
	// Convert JSON to worksheet
	const worksheet = XLSX.utils.json_to_sheet(data);

	// Create a new workbook and append the worksheet
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

	// Generate Excel buffer
	const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

	// Create a Blob and trigger download
	const blob = new Blob([excelBuffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
	});
	saveAs(blob, fileName);
}
