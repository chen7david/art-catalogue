import { useRef, useState } from "react";
import { readImageFile } from "@/lib/readImageFile";
import { Button } from "@/components/ui/Button";

interface ImageUploadFieldProps {
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  onChange: (data: { imageUrl: string; imageWidth: number; imageHeight: number }) => void;
}

export function ImageUploadField({ imageUrl, imageWidth, imageHeight, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    try {
      const { dataUrl, width, height } = await readImageFile(file);
      onChange({ imageUrl: dataUrl, imageWidth: width, imageHeight: height });
    } catch {
      setError("Could not read that image. Try a different file.");
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">Image</span>
      {imageUrl ? (
        <div className="mb-2 overflow-hidden rounded-md border border-ink/10">
          <img src={imageUrl} alt="Page artwork" className="max-h-64 w-full object-contain bg-ink/5" />
        </div>
      ) : (
        <div className="mb-2 flex h-32 items-center justify-center rounded-md border border-dashed border-ink/20 text-xs text-ink/40">
          No image uploaded
        </div>
      )}
      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          {imageUrl ? "Replace image" : "Upload image"}
        </Button>
        {imageWidth && imageHeight && (
          <span className="text-xs text-ink/50">
            {imageWidth} × {imageHeight}px
          </span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
