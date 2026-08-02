export interface ReadImageResult {
  dataUrl: string;
  width: number;
  height: number;
}

export function readImageFile(file: File): Promise<ReadImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
