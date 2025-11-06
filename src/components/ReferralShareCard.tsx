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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>Share with Friends & Save {REFERRAL_DISCOUNT_PERCENT}%</CardTitle>
        </div>
        <CardDescription>
          Generate your referral code and share it with 2 friends. You all save {REFERRAL_DISCOUNT_PERCENT}% on your purchase!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!myCode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
              />
            </div>
            <Button onClick={handleGenerateCode} className="w-full">
              Generate My Referral Code
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Your Referral Code:</p>
              <p className="text-2xl font-bold font-mono text-primary">{myCode}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Share this link:</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={getShareableReferralLink(myCode)}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Important:</strong> Using this code waives the standard 100-night sleep trial. All sales are final with referral discount codes.
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setMyCode("");
                setName("");
              }}
              className="w-full"
            >
              Generate a Different Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
