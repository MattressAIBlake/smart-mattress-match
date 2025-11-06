import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getShareableReferralLink } from "@/lib/referralUtils";

interface ReferralCardProps {
  referralCode: string;
  rewardBalance: number;
  totalReferrals: number;
}

export const ReferralCard = ({ referralCode, rewardBalance, totalReferrals }: ReferralCardProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const link = getShareableReferralLink(referralCode);
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Gift className="h-6 w-6 text-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">Friend Saves $50, You Get $50</h3>
            <Badge variant="secondary">{totalReferrals} referrals</Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Share your code with friends. They save $50 on their purchase, and you get a $50 Amazon gift card!
          </p>
          
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background/50 border rounded-lg px-4 py-2">
              <p className="text-xs text-muted-foreground">Your Code</p>
              <p className="font-mono font-bold text-lg">{referralCode}</p>
            </div>
            
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          {rewardBalance > 0 && (
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm font-semibold text-primary">
                Available Balance: ${rewardBalance.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
