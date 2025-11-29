import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { TypingIndicator } from "./TypingIndicator";
import { PostRecommendationActions } from "./PostRecommendationActions";
import { RecommendationShareCard } from "./RecommendationShareCard";
import { analyzeChatForProfile, saveSleepProfile, SleepProfile } from "@/lib/profileGenerator";
import { SALE_CONFIG } from "@/config/sale";
import { Badge } from "@/components/ui/badge";
import { ProductRecommendationCard } from "./ProductRecommendationCard";
import { QuickReplyChips } from "./QuickReplyChips";
import { SleepPositionSelector } from "./SleepPositionSelector";
import { ProgressIndicator } from "./ProgressIndicator";
import { ComparisonTable } from "./ComparisonTable";
import { FirmnessScale } from "./FirmnessScale";
import { VoiceInput } from "./VoiceInput";
import { OnboardingTooltip } from "./OnboardingTooltip";
import { SocialProofBadge } from "./SocialProofBadge";

type Message = { role: "user" | "assistant"; content: string };

// Convert markdown links, bold text, product recommendations, quick replies, comparisons, and firmness visuals to React elements
const renderMessageContent = (content: string, onQuickReply?: (option: string) => void, isLoading?: boolean) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  const productRecommendations: any[] = [];
  let quickReplyOptions: string[] = [];
  let comparisonHandles: string[] = [];
  let firmnessRange: [number, number] | null = null;
  let socialProofs: Array<{ type: 'popular' | 'rated' | 'trending'; text: string }> = [];

  lines.forEach((line, lineIdx) => {
    // Trim whitespace and check for special formats
    const trimmedLine = line.trim();
    
    // Check for comparison format: COMPARISON:handle1|handle2
    if (trimmedLine.startsWith('COMPARISON:')) {
      const handlesStr = trimmedLine.replace('COMPARISON:', '').trim();
      comparisonHandles = handlesStr.split('|').map(h => h.trim());
      return; // Skip this line in text rendering
    }
    
    // Check for firmness visual format: FIRMNESS_VISUAL:4-6
    if (trimmedLine.startsWith('FIRMNESS_VISUAL:')) {
      const rangeStr = trimmedLine.replace('FIRMNESS_VISUAL:', '').trim();
      const [min, max] = rangeStr.split('-').map(n => parseInt(n.trim()));
      if (!isNaN(min) && !isNaN(max)) {
        firmnessRange = [min, max];
      }
      return; // Skip this line in text rendering
    }
    
    // Check for social proof format: SOCIAL_PROOF:type|text
    if (trimmedLine.startsWith('SOCIAL_PROOF:')) {
      const proofStr = trimmedLine.replace('SOCIAL_PROOF:', '').trim();
      const [type, text] = proofStr.split('|');
      if (type && text && ['popular', 'rated', 'trending'].includes(type)) {
        socialProofs.push({ type: type as any, text: text.trim() });
      }
      return; // Skip this line in text rendering
    }
    
    // Check for quick reply format: QUICK_REPLIES:option1|option2|option3
    if (trimmedLine.startsWith('QUICK_REPLIES:')) {
      const optionsStr = trimmedLine.replace('QUICK_REPLIES:', '').trim();
      quickReplyOptions = optionsStr.split('|').map(opt => opt.trim());
      return; // Skip this line in text rendering
    }
    
    if (trimmedLine.startsWith('PRODUCT_RECOMMENDATION:')) {
      // Parse: handle?params|reason|features|price|matchPercentage
      const dataStr = trimmedLine.replace('PRODUCT_RECOMMENDATION:', '').trim();
      const parts = dataStr.split('|');
      
      console.log('Parsing product recommendation:', { line: trimmedLine, parts, partsLength: parts.length });
      
      if (parts.length >= 4) {
        const [handleWithParams, reason, featuresStr, priceStr, matchPercentageStr] = parts;
        const [handle, queryParams] = handleWithParams.split('?');
        
        productRecommendations.push({
          handle: handle.trim(),
          queryParams: queryParams || '',
          reason: reason.trim(),
          features: featuresStr.split(',').map(f => f.trim()),
          price: priceStr.trim().replace('$', ''),
          matchPercentage: matchPercentageStr?.trim(),
        });
      } else {
        console.warn('Invalid product recommendation format:', { line: trimmedLine, parts });
      }
      return; // Skip this line in text rendering
    }

    // Regular text processing for non-product lines
    const linkParts = line.split(/(\[.*?\]\(.*?\))/g);
    
    const processedLine = linkParts.map((part, index) => {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [, text, url] = linkMatch;
        return (
          <Link 
            key={`${lineIdx}-link-${index}`} 
            to={url} 
            className="text-primary underline hover:text-primary/80 font-medium"
          >
            {text}
          </Link>
        );
      }
      
      // Handle bold text within non-link parts
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((boldPart, boldIndex) => {
        const boldMatch = boldPart.match(/\*\*(.*?)\*\*/);
        if (boldMatch) {
          return <strong key={`${lineIdx}-${index}-bold-${boldIndex}`}>{boldMatch[1]}</strong>;
        }
        return <span key={`${lineIdx}-${index}-text-${boldIndex}`}>{boldPart}</span>;
      });
    });

    if (line.trim()) {
      elements.push(<p key={`line-${lineIdx}`} className="mb-2">{processedLine}</p>);
    }
  });

  // Add product recommendation cards after text
  if (productRecommendations.length > 0) {
    elements.push(
      <div className="mt-4 space-y-3" key="product-recommendations">
        {productRecommendations.map((rec, i) => (
          <ProductRecommendationCard key={`rec-${i}`} {...rec} />
        ))}
      </div>
    );
  }

  // Add comparison table if handles provided
  if (comparisonHandles.length > 0) {
    elements.push(
      <div className="mt-4" key="comparison-table">
        <ComparisonTable productHandles={comparisonHandles} />
      </div>
    );
  }

  // Add firmness scale if range provided
  if (firmnessRange) {
    elements.push(
      <div key="firmness-scale">
        <FirmnessScale recommendedRange={firmnessRange} />
      </div>
    );
  }

  // Add social proof badges if any
  if (socialProofs.length > 0) {
    elements.push(
      <div className="flex flex-wrap gap-2 mt-3" key="social-proofs">
        {socialProofs.map((proof, i) => (
          <SocialProofBadge key={i} type={proof.type} text={proof.text} />
        ))}
      </div>
    );
  }

  // Add quick reply chips if available
  if (quickReplyOptions.length > 0 && onQuickReply) {
    elements.push(
      <QuickReplyChips
        key="quick-replies"
        options={quickReplyOptions}
        onSelect={onQuickReply}
        disabled={isLoading}
      />
    );
  }

  return elements.length > 0 ? elements : content;
};

const conversationSteps = ["Sleep Position", "Preferences", "Your Match"];

export const MattressAIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "What's your primary sleep position?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [profile, setProfile] = useState<SleepProfile | null>(null);
  const [showPositionSelector, setShowPositionSelector] = useState(true);
  const [conversationStep, setConversationStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debounced streaming buffer - flush every 50ms for smooth updates
  useEffect(() => {
    if (!streamBuffer) return;
    
    const timer = setTimeout(() => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: m.content + streamBuffer } : m));
        }
        return [...prev, { role: "assistant", content: streamBuffer }];
      });
      setStreamBuffer("");
      scrollToBottom();
    }, 50);

    return () => clearTimeout(timer);
  }, [streamBuffer]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    setShowPositionSelector(false);
    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);
    
    // Update conversation step
    if (conversationStep < conversationSteps.length - 1) {
      setConversationStep((prev) => prev + 1);
    }

    let assistantContent = "";
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      // Buffer chunks for debounced updates
      setStreamBuffer((prev) => prev + chunk);
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mattress-ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      setIsTyping(false); // Stop typing indicator once stream starts

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Check if recommendation was made
      if (assistantContent.includes('PRODUCT_RECOMMENDATION:')) {
        setShowActions(true);
        setConversationStep(conversationSteps.length - 1);
      }

      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please try again.");
      setIsLoading(false);
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    }
  };

  const handleShare = async () => {
    if (!profile) {
      const generatedProfile = analyzeChatForProfile(messages);
      setProfile(generatedProfile);
    }
    setShareOpen(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickReply = (option: string) => {
    sendMessage(option);
  };

  const handlePositionSelect = (position: string) => {
    sendMessage(position);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Onboarding Tooltip */}
      <OnboardingTooltip />
      
      {/* Header Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI-Powered Sleep Matching</span>
        </div>
      </div>

      {/* Hero Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-3 tracking-tight leading-tight">
          Find Your Perfect Mattress
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-foreground/90 font-medium max-w-3xl mx-auto px-4">
          3 expert matches in 60 seconds—buy with confidence
        </p>
      </div>

      {/* Progress Indicator - Show after first message */}
      {messages.length > 1 && (
        <ProgressIndicator currentStep={conversationStep} steps={conversationSteps} />
      )}

      {/* Initial Centered Greeting + Visual Position Selector */}
      {messages.length === 1 && messages[0].role === "assistant" && (
        <div className="text-center mb-8 px-4 max-w-4xl mx-auto animate-fade-in">
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-medium mb-6">
            {messages[0].content}
          </p>
          {showPositionSelector && (
            <SleepPositionSelector onSelect={handlePositionSelect} disabled={isLoading} />
          )}
        </div>
      )}

      {/* Messages Area - Show conversation after first exchange */}
      {messages.length > 1 && (
        <div className="max-w-4xl mx-auto w-full mb-6 px-4">
          <div className="space-y-4">
            {messages.slice(1).map((message, idx) => (
              <div
                key={idx}
                ref={idx === messages.length - 2 ? lastMessageRef : null}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-6 py-4 transition-all duration-300 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20 shadow-md"
                  }`}
                >
                  <div className="text-base leading-relaxed" style={{ WebkitFontSmoothing: 'antialiased' }}>
                    {renderMessageContent(
                      message.content,
                      message.role === "assistant" && idx === messages.length - 2 ? handleQuickReply : undefined,
                      isLoading
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20 rounded-3xl px-6 py-4 shadow-md">
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>
          
          {/* Post-Recommendation Actions */}
          {showActions && (
          <PostRecommendationActions 
            onShare={handleShare}
          />
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="max-w-5xl mx-auto w-full px-4">
        <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 dark:border-white/20 p-3 sm:p-5">
          {/* Extra 10% Badge */}
          {SALE_CONFIG.SALE_ACTIVE && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 hidden md:block">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-lg animate-pulse">
                <Sparkles className="h-3 w-3" />
                <span>Earn Extra 10% Below</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <VoiceInput onTranscript={(text) => sendMessage(text)} disabled={isLoading} />
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your sleep style, pains, budget..."
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent text-base sm:text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 sm:h-14"
            />
            <Button 
              onClick={() => sendMessage()} 
              disabled={isLoading || !input.trim()} 
              size="lg"
              className="h-12 sm:h-14 px-4 sm:px-8 rounded-full transition-transform hover:scale-105 shadow-lg font-semibold whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin sm:mr-2" />
                  <span className="hidden sm:inline">Matching...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Start My Match</span>
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-3 text-center hidden sm:block">
            Try: "I sleep on my side" or "I run hot at night"
          </p>
        </div>
        
        {/* Secondary Browse Action */}
        <div className="text-center mt-4">
          <Link 
            to="/brands" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Prefer to browse? View all mattresses →
          </Link>
        </div>

      </div>
      <div ref={scrollRef} />
      
      {/* Share Dialog */}
      {profile && (
        <RecommendationShareCard
          open={shareOpen}
          onOpenChange={setShareOpen}
          profile={profile}
        />
      )}
    </div>
  );
};
