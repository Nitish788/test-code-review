"use client";

import { Button, Group, TextInput, Title } from "@mantine/core";
import { FormEvent, useState } from "react";
import styles from "./Form.module.css";
import type { Field, FormProps } from "./Form.types";

export function Form({
  fields,
  onSubmit,
  initialValues = {},
  submitLabel = "Save",
  onCancel,
  cancelLabel = "Cancel",
  title,
}: FormProps) {
  const [formData, setFormData] =
    useState<Record<string, string | boolean>>(initialValues);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextInput
            key={field.name}
            type={field.type}
            required={field.required}
            label={field.label}
            placeholder={field.placeholder}
            value={String(formData[field.name] || "")}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
            }
            className={styles.input}
            aria-label={field.label}
            id={field.name}
          />
        );
      case "checkbox":
        return (
          <div key={field.name} className={styles.formField}>
            <label className={styles.checkboxLabel} htmlFor={field.name}>
              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={Boolean(formData[field.name])}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: e.target.checked,
                    }))
                  }
                  className={styles.checkboxInput}
                  id={field.name}
                  aria-label={field.label}
                />
                <span className={styles.checkboxCustom} aria-hidden="true" />
              </div>
              <span className={styles.checkboxText}>{field.label}</span>
            </label>
          </div>
        );
      case "radio":
        return (
          <div key={field.name} className={styles.formField}>
            <label className={styles.label}>{field.label}</label>
            <div className={styles.radioGroup}>
              {field.options.map((option) => (
                <label key={option.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                    className={styles.radioInput}
                    required={field.required}
                    id={`${field.name}-${option.value}`}
                    aria-label={option.label}
                  />
                  <span className={styles.radioButton} />
                  <span className={styles.radioText}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case "select":
        return (
          <div key={field.name} className={styles.formField}>
            <label className={styles.label}>
              {field.label}
              {field.required && <span className={styles.required}> *</span>}
            </label>
            <select
              name={field.name}
              value={String(formData[field.name] || "")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              className={styles.select}
              required={field.required}
              id={field.name}
              aria-label={field.label}
            >
              <option value="">{field.placeholder || "Select..."}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {title && (
        <Title order={2} className={styles.title}>
          {title}
        </Title>
      )}
      {fields.map((field) => renderField(field))}
      <Group justify="flex-end" gap="sm" mt="xl">
        {onCancel && (
          <Button variant="light" onClick={onCancel} color="gray">
            {cancelLabel}
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </Group>
    </form>
  );
}
