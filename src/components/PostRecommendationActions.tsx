import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Gift, User } from "lucide-react";

interface PostRecommendationActionsProps {
  onShareProfile: () => void;
  onReferFriends: () => void;
  onShareChat: () => void;
}

export const PostRecommendationActions = ({
  onShareProfile,
  onReferFriends,
  onShareChat
}: PostRecommendationActionsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-6">
      <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer" onClick={onShareProfile}>
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Share Your Sleep Profile</h3>
            <p className="text-sm text-muted-foreground">
              Show friends your perfect match
            </p>
          </div>
          <Button variant="outline" className="w-full">
            Create Profile
          </Button>
        </div>
      </Card>
      
      <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" onClick={onReferFriends}>
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Refer Friends ($100)</h3>
            <p className="text-sm text-muted-foreground">
              You both get $100 rewards
            </p>
          </div>
          <Button variant="default" className="w-full">
            Get Your Code
          </Button>
        </div>
      </Card>
      
      <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer" onClick={onShareChat}>
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Share2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Share This Chat</h3>
            <p className="text-sm text-muted-foreground">
              Screenshot & post on social
            </p>
          </div>
          <Button variant="outline" className="w-full">
            Share Now
          </Button>
        </div>
      </Card>
    </div>
  );
};
