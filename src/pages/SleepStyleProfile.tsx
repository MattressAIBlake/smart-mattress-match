import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SLEEP_PERSONALITIES } from "@/lib/sleepStyleTypes";
import { SleepStyleResult } from "@/components/sleepstyle/SleepStyleResult";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";

export default function SleepStyleProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [personality, setPersonality] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('sleep_style_profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Increment share count
        await supabase.rpc('increment_sleep_style_share_count', { profile_id: id });

        const personalityData = SLEEP_PERSONALITIES[data.personality_type];
        setPersonality(personalityData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Sleep Style - ${personality?.name}`,
          text: `I'm "${personality?.tagline}" - Take the quiz and see if we're compatible! 😉`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!personality) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <Button onClick={() => navigate('/sleepstyle')}>
            Take the Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${personality.name} - Sleep Style | Mattress Wizard`}
        description={`${personality.tagline} - ${personality.description}`}
        ogImage={`${window.location.origin}/og-sleep-style.png`}
      />
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/sleepstyle')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Take Your Own Quiz
          </Button>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">
              Someone shared their Sleep Style with you!
            </h1>
            <p className="text-muted-foreground">
              Take the quiz yourself to see if you're compatible 💕
            </p>
          </div>

          <SleepStyleResult
            personality={personality}
            onShare={handleShare}
            shareUrl={window.location.href}
          />

          <div className="mt-8 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              onClick={() => navigate('/sleepstyle')}
            >
              Take the Quiz & Compare
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
