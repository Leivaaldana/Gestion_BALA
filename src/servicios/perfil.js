const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_DATA_URL_LENGTH = 245000;
const MAX_OUTPUT_BYTES = 180 * 1024;

export async function comprimirFotoPerfil(file) {
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Elegí una imagen JPG, PNG o WebP.");
  if (file.size > MAX_FILE_SIZE)
    throw new Error("La imagen original no puede superar los 8 MB.");

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("El navegador no pudo procesar la imagen.");

    for (const dimension of [512, 384, 256]) {
      const ratio = Math.min(1, dimension / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
      canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.82, 0.72, 0.62, 0.52]) {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
        const bytes = Math.floor((base64.length * 3) / 4);
        if (bytes <= MAX_OUTPUT_BYTES && dataUrl.length <= MAX_DATA_URL_LENGTH)
          return dataUrl;
      }
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("El navegador")) throw e;
    throw new Error("No se pudo procesar la imagen. Probá con otro archivo.");
  } finally {
    bitmap?.close();
  }

  throw new Error("No se pudo comprimir la imagen al tamaño máximo permitido.");
}
