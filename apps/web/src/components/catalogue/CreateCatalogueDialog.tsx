import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCatalogueSchema, type CreateCatalogueInput } from "@art-catalogue/shared";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { inputClasses } from "@/components/ui/inputClasses";
import { useCreateCatalogue } from "@/hooks/useCatalogues";

export function CreateCatalogueDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const createCatalogue = useCreateCatalogue();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCatalogueInput>({ resolver: zodResolver(createCatalogueSchema) });

  async function onSubmit(values: CreateCatalogueInput) {
    const catalogue = await createCatalogue.mutateAsync(values);
    reset();
    setOpen(false);
    navigate(`/catalogues/${catalogue.id}`);
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>New catalogue</Button>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-sm rounded-lg bg-paper p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-ink">New catalogue</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Name" error={errors.name?.message}>
            <input className={inputClasses} placeholder="e.g. Spring Exhibition 2027" {...register("name")} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCatalogue.isPending}>
              {createCatalogue.isPending ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
