import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Gift, Sparkles } from "lucide-react";
import { SEOScrollChallenge } from "./SEOScrollChallenge";

export const FloatingReferralWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-primary via-purple-600 to-pink-600 hover:scale-110 transition-all duration-300 group animate-pulse hover:animate-none"
        >
          <div className="relative">
            <Gift className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
            <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-spin" />
          </div>
          <span className="sr-only">Get 10% off referral code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <SEOScrollChallenge />
      </DialogContent>
    </Dialog>
  );
};
