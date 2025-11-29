import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Heart } from "lucide-react";
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

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share your Sleep Style on dating apps 💕",
      });
    }
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `my-sleep-style-${personality.id}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Image downloaded!",
        description: "Share it on your dating profile 📱",
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
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDownloadImage}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Image
        </Button>

        {shareUrl && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        )}

        <Button
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
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
