import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface ReferralWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralCode: string;
}

export const ReferralWelcome = ({ open, onOpenChange, referralCode }: ReferralWelcomeProps) => {
  const [timeLeft, setTimeLeft] = useState(7 * 24 * 60 * 60); // 7 days in seconds
  
  useEffect(() => {
    if (!open) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [open]);
  
  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Gift className="h-12 w-12 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">You've Been Referred!</DialogTitle>
          <DialogDescription className="text-center text-base">
            Your friend sent you a special gift
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 text-center">
            <p className="text-4xl font-bold text-primary mb-2">$100 OFF</p>
            <p className="text-sm text-muted-foreground">your first mattress purchase</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Offer expires in {days}d {hours}h</span>
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            <p>Referred with code: <span className="font-mono font-semibold">{referralCode}</span></p>
          </div>
          
          <Button className="w-full" size="lg" onClick={() => onOpenChange(false)}>
            Start Shopping & Save $100
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
