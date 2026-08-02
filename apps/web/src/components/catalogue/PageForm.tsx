import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPageSchema, type CreatePageInput, type Page } from "@art-catalogue/shared";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { inputClasses } from "@/components/ui/inputClasses";
import { ImageUploadField } from "./ImageUploadField";

interface PageFormValues extends CreatePageInput {
  imageUrl?: string;
}

interface PageFormProps {
  page: Page | null;
  isNew: boolean;
  onSubmit: (values: PageFormValues) => Promise<void>;
  isSaving: boolean;
}

export function PageForm({ page, isNew, onSubmit, isSaving }: PageFormProps) {
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PageFormValues>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      title: page?.title ?? "",
      description: page?.description ?? "",
      body: page?.body ?? "",
      imageUrl: page?.imageUrl,
      imageWidth: page?.imageWidth,
      imageHeight: page?.imageHeight,
    },
  });

  useEffect(() => {
    reset({
      title: page?.title ?? "",
      description: page?.description ?? "",
      body: page?.body ?? "",
      imageUrl: page?.imageUrl,
      imageWidth: page?.imageWidth,
      imageHeight: page?.imageHeight,
    });
  }, [page, reset]);

  async function submit(values: PageFormValues) {
    await onSubmit(values);
    setSavedAt(Date.now());
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Field label="Title" error={errors.title?.message}>
        <input className={inputClasses} {...register("title")} />
      </Field>

      <Field label="Description" error={errors.description?.message}>
        <input className={inputClasses} {...register("description")} />
      </Field>

      <Field label="Content" error={errors.body?.message}>
        <textarea className={`${inputClasses} min-h-[160px]`} {...register("body")} />
      </Field>

      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <ImageUploadField
            imageUrl={field.value}
            imageWidth={control._formValues.imageWidth}
            imageHeight={control._formValues.imageHeight}
            onChange={({ imageUrl, imageWidth, imageHeight }) => {
              field.onChange(imageUrl);
              control._formValues.imageWidth = imageWidth;
              control._formValues.imageHeight = imageHeight;
            }}
          />
        )}
      />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : isNew ? "Add page" : "Save changes"}
        </Button>
        {savedAt && !isNew && <span className="text-xs text-ink/40">Saved</span>}
      </div>
    </form>
  );
}
