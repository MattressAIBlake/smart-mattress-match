import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Check, Users } from "lucide-react";
import { generateReferralCode, getShareableReferralLink, REFERRAL_DISCOUNT_PERCENT } from "@/lib/referralUtils";
import { toast } from "sonner";

export const ReferralShareCard = () => {
  const [name, setName] = useState("");
  const [myCode, setMyCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateCode = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    const code = generateReferralCode(name);
    setMyCode(code);
    toast.success("Referral code generated!");
  };

  const handleCopyLink = () => {
    const link = getShareableReferralLink(myCode);
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="max-w-2xl mx-auto relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 opacity-50" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-500 shadow-lg">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Share & Save {REFERRAL_DISCOUNT_PERCENT}%
            </CardTitle>
            <CardDescription className="mt-1">
              Get your friends {REFERRAL_DISCOUNT_PERCENT}% off — everyone wins!
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {!myCode ? (
          <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-background/50 to-background border border-primary/10 backdrop-blur-sm">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="h-12 text-base border-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
            <Button onClick={handleGenerateCode} className="w-full h-12 text-base bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg hover:shadow-xl transition-all">
              Generate My Referral Code
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 border-2 border-primary/30 rounded-xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <p className="text-sm font-medium text-muted-foreground mb-3">Your Referral Code:</p>
              <p className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent tracking-wider relative z-10">{myCode}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Share this link:</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={getShareableReferralLink(myCode)}
                  className="font-mono text-sm bg-background/50 border-primary/20"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                <strong className="font-semibold">⚠️ Important:</strong> Using this code waives the standard 100-night sleep trial. All sales are final with referral discount codes.
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setMyCode("");
                setName("");
              }}
              className="w-full hover:bg-primary/5 transition-all"
            >
              Generate a Different Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
