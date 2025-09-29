import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportTablePDF(title, admin, columns, data) {
  const doc = new jsPDF();

  // === Encabezado principal ===
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("GESTIÓN UNIVERSITARIA", doc.internal.pageSize.getWidth() / 2, 15, {
    align: "center",
  });

  // Subtítulo (gris, centrado)
  const fecha = new Date().toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  doc.setFontSize(10);
  doc.setTextColor(100); // gris
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generado por: ${admin}  |  Fecha de generación: ${fecha}`,
    doc.internal.pageSize.getWidth() / 2,
    22,
    { align: "center" }
  );

  // Título de la tabla (centrado)
  doc.setFontSize(12);
  doc.setFont("helvetica");
  doc.setTextColor(0, 0, 0);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 32, { align: "center" });

  // === Tabla ===
  autoTable(doc, {
    startY: 35,
    head: [columns],
    body: data,
    styles: {
      halign: "center",
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [246, 139, 38], // bg-[#f68b26]
      textColor: [255, 255, 255], // blanco
      fontStyle: "bold",
    },
    bodyStyles: {
      fillColor: [255, 255, 255], // fondo blanco
      textColor: [0, 0, 0], // texto negro
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255], // filas todas blancas (sin zebra)
    },
    tableLineWidth: 0.2,
    horizontalLine: (rowIndex, node) => {
      // línea horizontal negra entre filas
      return rowIndex === 0 || rowIndex === node.table.body.length ? 0.2 : 0.2;
    },
    verticalLine: () => 0, // sin líneas verticales
  });

  // Descargar
  doc.save(`${title}.pdf`);
}
