import { Card } from "@/components/ui/card";
import { Share2, Users } from "lucide-react";

interface PostRecommendationActionsProps {
  onShare: () => void;
  onCompare?: () => void;
}

export const PostRecommendationActions = ({ onShare, onCompare }: PostRecommendationActionsProps) => {
  return (
    <div className="mt-6 grid md:grid-cols-2 gap-4">
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
              Download or share on social media
            </p>
          </div>
        </div>
      </Card>

      {onCompare && (
        <Card 
          className="p-6 hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/40 bg-gradient-to-br from-secondary/5 to-primary/5"
          onClick={onCompare}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-secondary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Share with Partner</h3>
              <p className="text-sm text-muted-foreground">
                Email comparison to decide together
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
