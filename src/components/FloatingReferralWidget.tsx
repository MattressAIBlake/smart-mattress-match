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
          className="fixed bottom-6 left-6 z-50 rounded-full shadow-2xl bg-gradient-to-br from-primary via-purple-600 to-pink-600 hover:scale-105 transition-all duration-300 group overflow-hidden px-5 py-3 h-auto"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <Gift className="h-5 w-5 text-white group-hover:rotate-12 transition-transform" />
              <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1" />
            </div>
            <span className="text-white font-semibold text-sm whitespace-nowrap">
              Earn Extra 10% Off
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <SEOScrollChallenge />
      </DialogContent>
    </Dialog>
  );
};
