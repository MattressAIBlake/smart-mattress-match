import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SleepStyleQuestion as QuestionType } from "@/lib/sleepStyleTypes";

interface SleepStyleQuestionProps {
  question: QuestionType;
  onAnswer: (questionId: string, answerId: string) => void;
  currentAnswer?: string;
}

export const SleepStyleQuestion = ({ question, onAnswer, currentAnswer }: SleepStyleQuestionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          {question.emoji}
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">{question.question}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Button
              variant={currentAnswer === option.id ? "default" : "outline"}
              className="w-full h-auto py-6 text-left flex items-center gap-4 hover:scale-105 transition-transform"
              onClick={() => onAnswer(question.id, option.id)}
            >
              <span className="text-4xl">{option.emoji}</span>
              <span className="text-lg font-medium">{option.label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
