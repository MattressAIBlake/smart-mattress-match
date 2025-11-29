import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Smartphone, Link2, Sparkles, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreQuizSharePromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreQuizSharePrompt = ({ isOpen, onClose }: PreQuizSharePromptProps) => {
  const { toast } = useToast();

  const quizUrl = window.location.origin + '/sleepstyle';
  const shareText = `Let's compare our Sleep Styles! 💕\n\nTake this 30-second quiz and see if we're compatible 😉\n\n${quizUrl}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(quizUrl);
    toast({
      title: "Link copied!",
      description: "Now send it to your match 😉",
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
          title: "Sleep Style Quiz",
          text: shareText,
          url: quizUrl,
        });
        onClose();
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleSkip}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="text-7xl text-center mb-4"
          >
            💕
          </motion.div>
          <DialogTitle className="text-center text-2xl">
            Share First, Compare Later!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Send this quiz to someone special and see if you're sleep compatible 😉
          </DialogDescription>
        </DialogHeader>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 relative z-10"
        >
          <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-4 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-red-500" />
              <p className="text-sm font-semibold">Perfect Ice Breaker!</p>
            </div>
            <p className="text-xs text-muted-foreground">
              "Hey, I found this fun quiz about sleep styles. Want to see if we're compatible?" 😏
            </p>
          </div>

          <div className="space-y-3">
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
                className="relative overflow-hidden group col-span-2"
              >
                <motion.div
                  className="absolute inset-0 bg-purple-500/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <Link2 className="mr-2 h-4 w-4 relative z-10" />
                <span className="relative z-10">Copy Link for Dating Apps</span>
              </Button>

              {navigator.share && (
                <Button 
                  onClick={handleNativeShare}
                  variant="outline"
                  className="relative overflow-hidden group col-span-2"
                >
                  <motion.div
                    className="absolute inset-0 bg-pink-500/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <Share2 className="mr-2 h-4 w-4 relative z-10" />
                  <span className="relative z-10">More Ways to Share</span>
                </Button>
              )}
            </div>

            <Button 
              onClick={handleSkip}
              variant="ghost"
              className="w-full"
            >
              I'll take the quiz first
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
