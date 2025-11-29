import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, MessageSquare, Download, Link as LinkIcon, Camera } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PartnerShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comparisonData: {
    products: any[];
    profileSummary: string;
    aiVerdict: string;
  };
}

export const PartnerShareDialog = ({
  open,
  onOpenChange,
  comparisonData,
}: PartnerShareDialogProps) => {
  const [shareMethod, setShareMethod] = useState<"email" | "sms" | "whatsapp">("email");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [includeProfile, setIncludeProfile] = useState(true);
  const [includePricing, setIncludePricing] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!recipientEmail || !senderName) {
      toast.error("Please fill in your name and recipient's email");
      return;
    }

    setIsSending(true);
    try {
      // Save comparison to database
      const { data: comparison, error: saveError } = await supabase
        .from("mattress_comparisons")
        .insert({
          sender_name: senderName,
          sender_email: recipientEmail,
          personal_note: personalNote,
          profile_data: { summary: comparisonData.profileSummary },
          compared_products: comparisonData.products,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Send email via edge function
      const { error: emailError } = await supabase.functions.invoke(
        "send-comparison-email",
        {
          body: {
            recipientEmail,
            senderName,
            personalNote,
            comparisonId: comparison.id,
            products: comparisonData.products,
            profileSummary: includeProfile ? comparisonData.profileSummary : null,
            includePricing,
          },
        }
      );

      if (emailError) throw emailError;

      toast.success("Comparison sent successfully! 🎉");
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending comparison:", error);
      toast.error("Failed to send comparison. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      // Save comparison first
      const { data: comparison, error: saveError } = await supabase
        .from("mattress_comparisons")
        .insert({
          sender_name: senderName || "Anonymous",
          personal_note: personalNote,
          profile_data: { summary: comparisonData.profileSummary },
          compared_products: comparisonData.products,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      const shareUrl = `${window.location.origin}/compare/${comparison.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard! 📋");
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">📤 Share with Your Partner</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Share Method Selection */}
          <div>
            <Label className="text-base mb-3 block">How would you like to share?</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={shareMethod === "email" ? "default" : "outline"}
                onClick={() => setShareMethod("email")}
                className="flex flex-col gap-2 h-auto py-4"
              >
                <Mail className="h-6 w-6" />
                <span>Email</span>
              </Button>
              <Button
                variant={shareMethod === "sms" ? "default" : "outline"}
                onClick={() => setShareMethod("sms")}
                className="flex flex-col gap-2 h-auto py-4"
                disabled
              >
                <MessageSquare className="h-6 w-6" />
                <span>SMS</span>
              </Button>
              <Button
                variant={shareMethod === "whatsapp" ? "default" : "outline"}
                onClick={() => setShareMethod("whatsapp")}
                className="flex flex-col gap-2 h-auto py-4"
                disabled
              >
                <MessageSquare className="h-6 w-6" />
                <span>WhatsApp</span>
              </Button>
            </div>
          </div>

          {/* Sender Name */}
          <div>
            <Label htmlFor="sender-name">Your Name</Label>
            <Input
              id="sender-name"
              placeholder="John Doe"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Recipient Email */}
          <div>
            <Label htmlFor="recipient-email">Partner's Email</Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder="spouse@email.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Personal Note */}
          <div>
            <Label htmlFor="personal-note">Add a personal note (optional)</Label>
            <Textarea
              id="personal-note"
              placeholder="Hey honey! Check out these mattresses I found for us. I'm leaning toward the first one - what do you think? 🛏️"
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-profile"
                checked={includeProfile}
                onCheckedChange={(checked) => setIncludeProfile(checked as boolean)}
              />
              <Label
                htmlFor="include-profile"
                className="text-sm font-normal cursor-pointer"
              >
                Include my sleep profile (recommended)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-pricing"
                checked={includePricing}
                onCheckedChange={(checked) => setIncludePricing(checked as boolean)}
              />
              <Label
                htmlFor="include-pricing"
                className="text-sm font-normal cursor-pointer"
              >
                Include current Black Friday pricing
              </Label>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendEmail}
            disabled={isSending}
            className="w-full"
            size="lg"
          >
            <Mail className="mr-2 h-5 w-5" />
            {isSending ? "Sending..." : "Send Comparison"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleCopyLink} className="gap-2">
              <LinkIcon className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" disabled className="gap-2">
              <Camera className="h-4 w-4" />
              Screenshot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
