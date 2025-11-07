import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Gift } from "lucide-react";
import { SEOScrollChallenge } from "./SEOScrollChallenge";

export const ReferralButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative group gap-2">
          <Gift className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Earn Extra 10% Off</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <SEOScrollChallenge />
      </DialogContent>
    </Dialog>
  );
};
