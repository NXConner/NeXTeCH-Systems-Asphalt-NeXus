
import { useState } from 'react';
import { z } from 'zod';

export const useFormValidation = <T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  initialValues: T
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isValid, setIsValid] = useState(false);

  const validate = (data: T) => {
    try {
      schema.parse(data);
      setErrors({});
      setIsValid(true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof T;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        setIsValid(false);
      }
      return false;
    }
  };

  const setValue = (field: keyof T, value: any) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    validate(newValues);
  };

  const setAllValues = (newValues: T) => {
    setValues(newValues);
    validate(newValues);
  };

  return {
    values,
    errors,
    isValid,
    setValue,
    setAllValues,
    validate: () => validate(values)
  };
};
