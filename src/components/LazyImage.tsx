import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { optimizeShopifyImage } from "@/lib/shopify";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  responsive?: boolean;
}

export const LazyImage = ({ src, alt, className, fallback, responsive = true, ...props }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isError) {
    return (
      <div className={cn("bg-gradient-soft flex items-center justify-center", className)}>
        {fallback || <span className="text-muted-foreground text-sm">Image unavailable</span>}
      </div>
    );
  }

  // Generate responsive image URLs if this is a Shopify image
  const isShopifyImage = src?.includes('myshopify.com') || src?.includes('cdn.shopify.com');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className={cn("absolute inset-0 bg-muted animate-pulse", className)} />
      )}
      <img
        ref={imgRef}
        src={isInView && src ? (isShopifyImage ? optimizeShopifyImage(src, isMobile ? 600 : 1200) : src) : undefined}
        srcSet={
          isInView && responsive && isShopifyImage
            ? `${optimizeShopifyImage(src, 400)} 400w, ${optimizeShopifyImage(src, 800)} 800w${
                !isMobile ? `, ${optimizeShopifyImage(src, 1200)} 1200w` : ''
              }`
            : undefined
        }
        sizes={responsive ? "(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px" : undefined}
        alt={alt}
        loading="lazy"
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        {...props}
      />
    </div>
  );
};
