import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SleepStyleQuestion } from "@/components/sleepstyle/SleepStyleQuestion";
import { SleepStyleResult } from "@/components/sleepstyle/SleepStyleResult";
import { ShareCelebration } from "@/components/sleepstyle/ShareCelebration";
import { PreQuizSharePrompt } from "@/components/sleepstyle/PreQuizSharePrompt";
import { 
  SLEEP_STYLE_QUESTIONS, 
  calculateSleepPersonality,
  SLEEP_PERSONALITIES 
} from "@/lib/sleepStyleTypes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/seo/SEOHead";

export default function SleepStyleQuiz() {
  const [showPreQuizPrompt, setShowPreQuizPrompt] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();
  const { toast } = useToast();

  // Show pre-quiz share prompt on first load
  useEffect(() => {
    const hasSeenPrompt = sessionStorage.getItem('sleep-style-pre-quiz-prompt');
    if (!hasSeenPrompt) {
      setShowPreQuizPrompt(true);
      sessionStorage.setItem('sleep-style-pre-quiz-prompt', 'true');
    }
  }, []);

  const progress = ((currentQuestion + 1) / SLEEP_STYLE_QUESTIONS.length) * 100;
  const currentQ = SLEEP_STYLE_QUESTIONS[currentQuestion];

  const handleAnswer = (questionId: string, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    // Auto-advance to next question
    setTimeout(() => {
      if (currentQuestion < SLEEP_STYLE_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        completeQuiz(newAnswers);
      }
    }, 300);
  };

  const completeQuiz = async (finalAnswers: Record<string, string>) => {
    const personalityType = calculateSleepPersonality(finalAnswers);
    
    try {
      const { data, error } = await supabase
        .from('sleep_style_profiles')
        .insert({
          personality_type: personalityType,
          answers: finalAnswers,
        })
        .select()
        .single();

      if (error) throw error;

      const url = `${window.location.origin}/sleepstyle/${data.id}`;
      setShareUrl(url);
      setShowCelebration(true);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Oops!",
        description: "Couldn't save your results. But you can still see them!",
        variant: "destructive",
      });
      setIsComplete(true);
    }
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    setIsComplete(true);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Sleep Style',
          text: 'I just discovered my Sleep Style! Take the quiz and see if we\'re compatible 😉',
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share it on your dating apps 💕",
      });
    }
  };

  const personalityType = (isComplete || showCelebration) ? calculateSleepPersonality(answers) : null;
  const personality = personalityType ? SLEEP_PERSONALITIES[personalityType] : null;

  if (isComplete && personality) {
    return (
      <>
        <SEOHead
          title="My Sleep Style Quiz Results | Mattress Wizard"
          description="I just discovered my sleep style! Take the quiz and see if we're compatible."
        />
        <div className="min-h-screen bg-background py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>

            <SleepStyleResult
              personality={personality}
              onShare={handleShare}
              shareUrl={shareUrl}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Sleep Style Quiz - Dating Ice Breaker | Mattress Wizard"
        description="Discover your sleep style personality! Perfect ice breaker for dating apps. Are you a Cuddle Monster or a Starfish? Take our fun 30-second quiz!"
      />
      
      {/* Pre-Quiz Share Prompt */}
      <PreQuizSharePrompt
        isOpen={showPreQuizPrompt}
        onClose={() => setShowPreQuizPrompt(false)}
      />
      
      {/* Share Celebration Modal */}
      {showCelebration && personality && shareUrl && (
        <ShareCelebration
          isOpen={showCelebration}
          onClose={handleCloseCelebration}
          personality={personality}
          shareUrl={shareUrl}
        />
      )}

      <div className="min-h-screen bg-background py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent"
            >
              What's Your Sleep Style?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              The perfect ice breaker for your next date 💕
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {SLEEP_STYLE_QUESTIONS.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <SleepStyleQuestion
              key={currentQ.id}
              question={currentQ}
              onAnswer={handleAnswer}
              currentAnswer={answers[currentQ.id]}
            />
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {answers[currentQ.id] && currentQuestion === SLEEP_STYLE_QUESTIONS.length - 1 && (
              <Button
                onClick={() => completeQuiz(answers)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                See My Results
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
