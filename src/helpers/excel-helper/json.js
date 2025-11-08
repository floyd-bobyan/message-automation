import * as XLSX from "xlsx";

export const excelToJson = async ({file, sheetName}) => {
  try {
    // Read file as array buffer
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    // Get first sheet
    const fileSheet = sheetName || workbook.SheetNames[0];
    const sheet = workbook.Sheets[fileSheet];

    // Convert to JSON
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    return json;
  } catch (err) {
    console.error("Excel to JSON error:", err);
    return [];
  }
};
