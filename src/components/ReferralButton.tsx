import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Gift } from "lucide-react";
import { ReferralShareCard } from "./ReferralShareCard";

export const ReferralButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative group">
          <Gift className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <ReferralShareCard />
      </DialogContent>
    </Dialog>
  );
};
