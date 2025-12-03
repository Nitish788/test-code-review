"use client";

import { useState } from "react";
import { CustomFieldType } from "@/app/shared/types/enums";
import { CustomFieldsManagerPresentation } from "./CustomFieldsManager.presentation";
import type { CustomFieldsManagerProps } from "./CustomFieldsManager.types";

export function CustomFieldsManager(props: CustomFieldsManagerProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (values: Record<string, string | boolean>) => {
    try {
      if (
        props.customFields.some(
          (field) =>
            field.name.toLowerCase() === String(values.name).toLowerCase()
        )
      ) {
        throw new Error("A field with this name already exists");
      }

      const nameRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
      if (!nameRegex.test(String(values.name))) {
        throw new Error(
          "Field name must start with a letter and contain only letters, numbers, and spaces"
        );
      }

      props.onAddField({
        name: String(values.name),
        type: String(values.type) as CustomFieldType,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <CustomFieldsManagerPresentation
      {...props}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
