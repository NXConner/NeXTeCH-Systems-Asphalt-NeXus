import { useState, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';
import { useNotifications } from './useNotifications';
import { config } from '@/config/env';

type UploadProgress = {
  progress: number;
  uploaded: number;
  total: number;
};

type UploadOptions = {
  maxSize?: number;
  allowedTypes?: string[];
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
};

export function useFileUpload(options: UploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    progress: 0,
    uploaded: 0,
    total: 0,
  });

  const { trackEvent, trackError } = useAnalytics();
  const { addNotification } = useNotifications();

  const validateFile = useCallback(
    (file: File) => {
      const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/*', 'application/pdf'] } = options;

      if (file.size > maxSize) {
        throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
      }

      const isValidType = allowedTypes.some((type) => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(category);
        }
        return file.type === type;
      });

      if (!isValidType) {
        throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }

      return true;
    },
    [options]
  );

  const upload = useCallback(
    async (file: File) => {
      try {
        validateFile(file);
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${config.api.url}/upload`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = {
              progress: (event.loaded / event.total) * 100,
              uploaded: event.loaded,
              total: event.total,
            };
            setProgress(progress);
            options.onProgress?.(progress);
          }
        };

        const response = await new Promise<string>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(xhr.responseText);
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };
          xhr.onerror = () => reject(new Error('Upload failed'));
          xhr.send(formData);
        });

        const result = JSON.parse(response);
        trackEvent({
          category: 'FileUpload',
          action: 'success',
          label: file.type,
          value: file.size,
        });

        addNotification({
          type: 'success',
          title: 'Upload Complete',
          message: 'File uploaded successfully',
        });

        options.onSuccess?.(result.url);
        return result.url;
      } catch (error) {
        const err = error as Error;
        trackError(err, { fileName: file.name, fileType: file.type, fileSize: file.size });
        addNotification({
          type: 'error',
          title: 'Upload Failed',
          message: err.message,
        });
        options.onError?.(err);
        throw err;
      } finally {
        setUploading(false);
        setProgress({ progress: 0, uploaded: 0, total: 0 });
      }
    },
    [options, validateFile, trackEvent, trackError, addNotification]
  );

  return {
    upload,
    uploading,
    progress,
  };
} 