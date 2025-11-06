import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareChatButtonProps {
  onClick: () => void;
}

export const ShareChatButton = ({ onClick }: ShareChatButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="mt-2"
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share This Recommendation
    </Button>
  );
};
