import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Link2, Heart, MessageCircle, Smartphone } from "lucide-react";
import { SleepPersonality } from "@/lib/sleepStyleTypes";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { useRef } from "react";

interface SleepStyleResultProps {
  personality: SleepPersonality;
  onShare: () => void;
  shareUrl?: string;
}

export const SleepStyleResult = ({ personality, onShare, shareUrl }: SleepStyleResultProps) => {
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);

  const shareText = `I'm "${personality.name}" ${personality.emoji} - "${personality.tagline}"\n\nAre we sleep compatible? Take the quiz 😉\n\n${shareUrl || 'mattresswizard.com/sleepstyle'}`;

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share your sleep style with your matches 😉",
      });
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleSMSShare = () => {
    const url = `sms:?body=${encodeURIComponent(shareText)}`;
    window.location.href = url;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${personality.name} ${personality.emoji}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleDownloadImage = async (format: 'square' | 'story' = 'square') => {
    if (!resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        width: format === 'story' ? 1080 : 1080,
        height: format === 'story' ? 1920 : 1080,
      });
      
      const link = document.createElement('a');
      link.download = `sleep-style-${personality.id}-${format}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Image downloaded!",
        description: format === 'story' ? "Perfect for Instagram Stories! 📱" : "Share it on your dating apps 📱",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Oops!",
        description: "Couldn't generate image. Try again?",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Confetti effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2 }}
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,182,193,0.3) 0%, transparent 70%)',
        }}
      />

      {/* Shareable Result Card */}
      <div ref={resultRef} className="relative">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-4"
            >
              {personality.emoji}
            </motion.div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {personality.name}
            </CardTitle>
            <p className="text-xl text-muted-foreground italic mt-2">"{personality.tagline}"</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">About You:</h3>
              <p className="text-muted-foreground">{personality.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Your Traits:</h3>
              <div className="flex flex-wrap gap-2">
                {personality.traits.map((trait, index) => (
                  <motion.span
                    key={trait}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {trait}
                  </motion.span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Compatible With:
              </h3>
              <div className="space-y-1">
                {personality.compatibleWith.map((type) => (
                  <p key={type} className="text-muted-foreground capitalize">
                    • {type.replace(/-/g, ' ')}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Red Flags to Share:</h3>
              <div className="space-y-1">
                {personality.redFlags.map((flag) => (
                  <p key={flag} className="text-muted-foreground text-sm">
                    🚩 {flag}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Dating App Bio:</h3>
              <p className="text-muted-foreground italic">"{personality.datingAppPitch}"</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => handleDownloadImage('square')} variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Square (Instagram)
          </Button>
          <Button onClick={() => handleDownloadImage('story')} variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Story (1080x1920)
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleWhatsAppShare} variant="outline" className="flex-1">
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
          <Button onClick={handleSMSShare} variant="outline" className="flex-1">
            <Smartphone className="mr-2 h-4 w-4" />
            Text
          </Button>
          {shareUrl && (
            <Button onClick={handleCopyLink} variant="outline" className="flex-1">
              <Link2 className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          )}
        </div>

        {navigator.share && (
          <Button 
            onClick={handleNativeShare} 
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share More Ways
          </Button>
        )}
      </div>

      {/* Fun CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center"
      >
        <p className="text-muted-foreground mb-4">
          Looking for the perfect mattress for your sleep style?
        </p>
        <Button variant="outline" size="lg" onClick={() => window.location.href = '/'}>
          Take Full Mattress Quiz
        </Button>
      </motion.div>
    </motion.div>
  );
};
