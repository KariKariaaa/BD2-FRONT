export function exportLog(filename, data) {
  // Convertimos el array en texto con saltos de línea
  const logContent = data.join("\n");

  // Creamos un blob de tipo texto
  const blob = new Blob([logContent], { type: "text/plain" });

  // Creamos un enlace temporal
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith(".log") ? filename : `${filename}.log`;

  // Disparamos la descarga
  document.body.appendChild(link);
  link.click();

  // Limpieza
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
