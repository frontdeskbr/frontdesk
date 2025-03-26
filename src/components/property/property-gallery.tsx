
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid3X3, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setShowFullGallery(true);
  };

  return (
    <>
      <div className="relative">
        {/* Main gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
          {/* Main image */}
          <div 
            className="relative col-span-1 md:row-span-2 h-64 md:h-full cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setShowFullGallery(true)}
          >
            <img 
              src={images[0]} 
              alt={`${title} - Imagem principal`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Grid of 4 smaller images */}
          <div className="grid grid-cols-2 gap-2 h-64">
            {images.slice(1, 5).map((image, index) => (
              <div 
                key={index} 
                className="relative cursor-pointer overflow-hidden rounded-lg"
                onClick={() => handleThumbnailClick(index + 1)}
              >
                <img 
                  src={image} 
                  alt={`${title} - Imagem ${index + 2}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* View all photos button */}
        {images.length > 5 && (
          <button 
            className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 shadow-md rounded-md px-3 py-2 flex items-center gap-2 text-sm font-medium"
            onClick={() => setShowFullGallery(true)}
          >
            <Grid3X3 size={16} />
            Ver todas as fotos ({images.length})
          </button>
        )}
      </div>

      {/* Full gallery modal */}
      {showFullGallery && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button 
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={() => setShowFullGallery(false)}
          >
            <X size={24} />
          </button>

          {/* Gallery navigation */}
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={handlePrevious}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={handleNext}
          >
            <ChevronRight size={24} />
          </button>

          {/* Main image */}
          <div className="max-h-[80vh] max-w-[90vw]">
            <img 
              src={images[currentIndex]} 
              alt={`${title} - Imagem ${currentIndex + 1}`} 
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2">
            {images.map((image, index) => (
              <div 
                key={index} 
                className={cn(
                  "h-16 w-24 cursor-pointer overflow-hidden rounded border-2",
                  index === currentIndex ? "border-white" : "border-transparent opacity-70"
                )}
                onClick={() => setCurrentIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
