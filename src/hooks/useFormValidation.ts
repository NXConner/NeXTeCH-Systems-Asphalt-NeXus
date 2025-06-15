import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useAnalytics } from './useAnalytics';

type ValidationError = {
  field: string;
  message: string;
};

export function useFormValidation<T extends z.ZodType>(schema: T) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const { trackEvent } = useAnalytics();

  const validate = useCallback(
    (data: unknown) => {
      try {
        schema.parse(data);
        setErrors([]);
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationErrors = error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          setErrors(validationErrors);
          trackEvent({
            category: 'Form',
            action: 'validation_error',
            label: schema.description || 'unknown',
            properties: {
              errors: validationErrors,
            },
          });
        }
        return false;
      }
    },
    [schema, trackEvent]
  );

  const getFieldError = useCallback(
    (field: string) => {
      return errors.find((error) => error.field === field)?.message;
    },
    [errors]
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    validate,
    getFieldError,
    clearErrors,
    errors,
  };
}
