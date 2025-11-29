import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Smartphone, Link2, Sparkles } from "lucide-react";
import { SleepPersonality } from "@/lib/sleepStyleTypes";
import { useToast } from "@/hooks/use-toast";

interface ShareCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  personality: SleepPersonality;
  shareUrl: string;
}

export const ShareCelebration = ({ isOpen, onClose, personality, shareUrl }: ShareCelebrationProps) => {
  const { toast } = useToast();

  const shareText = `I'm "${personality.name}" ${personality.emoji} - "${personality.tagline}"\n\nAre we sleep compatible? Take the quiz 😉\n\n${shareUrl}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Now paste it in your dating app 😉",
    });
    onClose();
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleSMSShare = () => {
    const url = `sms:?body=${encodeURIComponent(shareText)}`;
    window.location.href = url;
    onClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${personality.name} ${personality.emoji}`,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Confetti Background */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg"
              >
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      y: -100, 
                      x: Math.random() * 400 - 200,
                      rotate: 0,
                      opacity: 1
                    }}
                    animate={{ 
                      y: 600, 
                      rotate: 360,
                      opacity: [1, 1, 0]
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5,
                      ease: "linear"
                    }}
                    className="absolute text-2xl"
                    style={{ left: `${Math.random() * 100}%` }}
                  >
                    {['🎉', '💕', '✨', '💫', '🌟', '❤️'][Math.floor(Math.random() * 6)]}
                  </motion.div>
                ))}
              </motion.div>

              <DialogHeader className="relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="text-7xl text-center mb-4"
                >
                  {personality.emoji}
                </motion.div>
                <DialogTitle className="text-center text-2xl">
                  You're {personality.name}!
                </DialogTitle>
                <DialogDescription className="text-center text-base">
                  Share your sleep style and see who's compatible 💕
                </DialogDescription>
              </DialogHeader>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 relative z-10"
              >
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <p className="text-sm font-medium mb-1">Your Dating App Bio:</p>
                  <p className="text-sm text-muted-foreground italic">"{personality.datingAppPitch}"</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={handleWhatsAppShare} 
                    variant="outline"
                    className="relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-green-500/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <MessageCircle className="mr-2 h-4 w-4 relative z-10" />
                    <span className="relative z-10">WhatsApp</span>
                  </Button>

                  <Button 
                    onClick={handleSMSShare} 
                    variant="outline"
                    className="relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-blue-500/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <Smartphone className="mr-2 h-4 w-4 relative z-10" />
                    <span className="relative z-10">Text</span>
                  </Button>

                  <Button 
                    onClick={handleCopyLink} 
                    variant="outline"
                    className="relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-purple-500/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <Link2 className="mr-2 h-4 w-4 relative z-10" />
                    <span className="relative z-10">Copy Link</span>
                  </Button>

                  {navigator.share && (
                    <Button 
                      onClick={handleNativeShare}
                      variant="outline"
                      className="relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-pink-500/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <Share2 className="mr-2 h-4 w-4 relative z-10" />
                      <span className="relative z-10">More</span>
                    </Button>
                  )}
                </div>

                <Button 
                  onClick={onClose}
                  variant="ghost"
                  className="w-full"
                >
                  View Full Results
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
