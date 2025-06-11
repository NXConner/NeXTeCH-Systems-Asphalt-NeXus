import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from './optimized-image';
import { Button } from './button';

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }[];
  className?: string;
  thumbnailSize?: number;
  gap?: number;
  columns?: number;
}

export function ImageGallery({
  images,
  className,
  thumbnailSize = 200,
  gap = 16,
  columns = 4,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = useCallback((index: number) => {
    setSelectedImage(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft' && selectedImage > 0) {
        setSelectedImage(selectedImage - 1);
      } else if (e.key === 'ArrowRight' && selectedImage < images.length - 1) {
        setSelectedImage(selectedImage + 1);
      }
    },
    [selectedImage, images.length, handleClose]
  );

  return (
    <div
      className={cn('relative', className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap}px`,
        }}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.src}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => handleImageClick(index)}
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              width={thumbnailSize}
              height={thumbnailSize}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={handleClose}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-50 text-white"
              onClick={handleClose}
            >
              <X className="h-6 w-6" />
            </Button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                width={images[selectedImage].width}
                height={images[selectedImage].height}
                className="h-full w-full object-contain"
                priority
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
                <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-white">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 