import { Card } from "@/components/ui/card";
import { Share2 } from "lucide-react";

interface PostRecommendationActionsProps {
  onShare: () => void;
}

export const PostRecommendationActions = ({ onShare }: PostRecommendationActionsProps) => {
  return (
    <div className="mt-6">
      <Card 
        className="p-6 hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 to-purple-500/5"
        onClick={onShare}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Share2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Share Your Match</h3>
            <p className="text-sm text-muted-foreground">
              Download your personalized recommendation and share on social media
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
