import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, X } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { SleepProfile as SleepProfileType } from "@/lib/profileGenerator";

interface RecommendationShareCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: SleepProfileType;
}

export const RecommendationShareCard = ({ open, onOpenChange, profile }: RecommendationShareCardProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleCapture = async () => {
    if (!cardRef.current) return;
    
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        windowWidth: 1200,
        windowHeight: 1600
      });
      
      const link = document.createElement('a');
      link.download = 'my-mattress-recommendation.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success("Recommendation saved!");
    } catch (error) {
      console.error('Screenshot failed:', error);
      toast.error("Failed to capture recommendation");
    } finally {
      setIsCapturing(false);
    }
  };
  
  const shareText = "Just got my perfect mattress recommendation from AI! 🛏️✨ Find yours at";
  
  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(window.location.origin);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText} ${encodedUrl}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Perfect Mattress Match</DialogTitle>
        </DialogHeader>
        
        <div ref={cardRef} className="space-y-6 p-6 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 rounded-lg">
          {/* Header with Icon */}
          <div className="text-center space-y-2">
            <div className="text-7xl mb-3">{profile.profileIcon}</div>
            <h2 className="text-3xl font-bold">Your Sleep Profile</h2>
            <p className="text-muted-foreground">AI-Powered Personalized Recommendation</p>
          </div>
          
          {/* Sleep Profile Details */}
          <Card className="p-6 bg-background/80 backdrop-blur">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Sleep Position</p>
                <p className="text-lg font-semibold">{profile.sleepPosition}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Firmness Level</p>
                <p className="text-lg font-semibold">{profile.firmness}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Temperature</p>
                <p className="text-lg font-semibold">{profile.temperaturePreference}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Support Needs</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.supportNeeds.slice(0, 3).map((need, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Recommended Mattresses */}
          {profile.recommendedProducts && profile.recommendedProducts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center">Perfect Matches For You</h3>
              <div className="grid gap-4">
                {profile.recommendedProducts.slice(0, 3).map((product: any, index: number) => (
                  <Card key={index} className="p-4 bg-background/80 backdrop-blur">
                    <div className="flex gap-4 items-start">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-semibold text-lg">{product.title}</h4>
                          <p className="text-sm text-muted-foreground">{product.vendor}</p>
                        </div>
                        {product.matchReason && (
                          <p className="text-sm text-primary font-medium">
                            ✓ {product.matchReason}
                          </p>
                        )}
                      </div>
                      {product.price && (
                        <div className="text-right">
                          <p className="text-lg font-bold">${parseFloat(product.price).toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground font-medium">
              Powered by Mattress Wizard AI 🛏️
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {window.location.origin}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            variant="default"
            className="w-full"
            onClick={handleCapture}
            disabled={isCapturing}
          >
            <Download className="h-4 w-4 mr-2" />
            {isCapturing ? "Capturing..." : "Download & Share"}
          </Button>
          
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => handleShare('twitter')} className="w-full">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X
            </Button>
            <Button variant="outline" onClick={() => handleShare('facebook')} className="w-full">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
            <Button variant="outline" onClick={() => handleShare('whatsapp')} className="w-full">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
