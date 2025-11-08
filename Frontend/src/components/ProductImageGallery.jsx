import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const ProductImageGallery = ({ productId, images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (images.length > 0) {
      setIsLoading(false);
    }
  }, [images]);

  const getImageUrl = (imageId, width = null) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4002';
    if (width) {
      return `${baseUrl}/images/${imageId}?w=${width}`;
    }
    return `${baseUrl}/images/${imageId}`;
  };

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center aspect-square">
        <div className="text-center text-gray-400">
          <svg
            className="mx-auto h-12 w-12 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">Sin imágenes</p>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative bg-white rounded-lg overflow-hidden aspect-square group">
        <img
          src={getImageUrl(selectedImage.id)}
          srcSet={`
            ${getImageUrl(selectedImage.id, 320)} 320w,
            ${getImageUrl(selectedImage.id, 800)} 800w,
            ${getImageUrl(selectedImage.id)} ${selectedImage.width}w
          `}
          sizes="(max-width: 640px) 320px, (max-width: 1024px) 800px, 1000px"
          alt={`Producto ${productId} - Imagen ${selectedIndex + 1}`}
          className="w-full h-full object-contain"
          loading="lazy"
          style={{ aspectRatio: `${selectedImage.width}/${selectedImage.height}` }}
        />

        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Indicador de posición */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`
                relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                ${
                  index === selectedIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-gray-300'
                }
              `}
            >
              <img
                src={getImageUrl(image.id, 320)}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {image.isPrimary && (
                <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                  Principal
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
