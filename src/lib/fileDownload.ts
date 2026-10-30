export function downloadBlob(
  content: string | Blob,
  filename: string,
  mimeType: string = "text/csv;charset=utf-8;"
): void {
  const blob =
    content instanceof Blob
      ? content
      : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.style.position = "fixed";
  link.style.top = "-9999px";
  link.style.left = "-9999px";
  link.style.opacity = "0";
  link.style.pointerEvents = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

