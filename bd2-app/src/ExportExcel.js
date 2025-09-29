import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportTableExcel(title, admin, columns, data) {
  // === Encabezado personalizado ===
  const fecha = new Date().toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const encabezado = [
    ["GESTIÓN UNIVERSITARIA"],
    [`Generado por: ${admin}  |  Fecha de generación: ${fecha}`],
    [title],
    [], // fila vacía antes de la tabla
    columns,
  ];

  // Unimos encabezado con datos
  const contenido = [...encabezado, ...data];

  // Creamos hoja de Excel
  const ws = XLSX.utils.aoa_to_sheet(contenido);

  // Ajustar ancho de columnas automáticamente
  const maxWidths = columns.map((col, i) =>
    Math.max(
      col.length,
      ...data.map((row) => (row[i] ? row[i].toString().length : 0))
    )
  );
  ws["!cols"] = maxWidths.map((w) => ({ wch: w + 5 }));

  // Creamos libro
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte");

  // Exportar
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${title}.xlsx`);
}
