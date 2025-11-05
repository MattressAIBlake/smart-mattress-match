import { useState, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";
import NotFound from "./pages/NotFound";

// Lazy load route components for code splitting
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const BrandPage = lazy(() => import("./pages/BrandPage"));

const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes for product data
            gcTime: 10 * 60 * 1000, // 10 minutes in memory (formerly cacheTime)
            refetchOnWindowFocus: false, // Don't refetch on tab switch
            retry: 1, // Only retry once on failure
          },
        },
      })
  );
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/product/:handle"
              element={
                <Suspense fallback={<div className="container mx-auto px-4 py-8"><ProductGridSkeleton count={1} /></div>}>
                  <ProductDetail />
                </Suspense>
              }
            />
            <Route
              path="/brand/:brandSlug"
              element={
                <Suspense fallback={<div className="container mx-auto px-4 py-8"><ProductGridSkeleton count={6} /></div>}>
                  <BrandPage />
                </Suspense>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
