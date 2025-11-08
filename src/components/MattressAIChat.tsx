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

type Message = { role: "user" | "assistant"; content: string };

import { ProductRecommendationCard } from "./ProductRecommendationCard";

// Convert markdown links, bold text, and product recommendations to React elements
const renderMessageContent = (content: string) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  const productRecommendations: any[] = [];

  lines.forEach((line, lineIdx) => {
    // Trim whitespace and check for product recommendation format
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('PRODUCT_RECOMMENDATION:')) {
      // Parse: handle?params|reason|features|price
      const dataStr = trimmedLine.replace('PRODUCT_RECOMMENDATION:', '').trim();
      const parts = dataStr.split('|');
      
      console.log('Parsing product recommendation:', { line: trimmedLine, parts, partsLength: parts.length });
      
      if (parts.length >= 4) {
        const [handleWithParams, reason, featuresStr, priceStr] = parts;
        const [handle, queryParams] = handleWithParams.split('?');
        
        productRecommendations.push({
          handle: handle.trim(),
          queryParams: queryParams || '',
          reason: reason.trim(),
          features: featuresStr.split(',').map(f => f.trim()),
          price: priceStr.trim().replace('$', ''),
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

  return elements.length > 0 ? elements : content;
};

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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

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

  return (
    <div className="w-full flex flex-col">
      {/* Header Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI-Powered Sleep Matching</span>
        </div>
      </div>

      {/* Hero Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 tracking-tight">
          Find Your Perfect Mattress
        </h1>
        {SALE_CONFIG.SALE_ACTIVE && (
          <p className="text-lg md:text-xl text-amber-700 dark:text-amber-400 font-semibold">
            Save {SALE_CONFIG.DISCOUNT_PERCENT}% Today
          </p>
        )}
      </div>

      {/* Initial Centered Greeting - Only show if it's the first message */}
      {messages.length === 1 && messages[0].role === "assistant" && (
        <div className="text-center mb-12 px-4 max-w-4xl mx-auto animate-fade-in">
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-medium">
            {messages[0].content}
          </p>
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
                    {renderMessageContent(message.content)}
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
        <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 dark:border-white/20 p-5">
          <div className="flex items-center gap-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me about your sleep needs..."
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 h-14"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()} 
              size="icon"
              className="h-14 w-14 rounded-full transition-transform hover:scale-110 shadow-lg"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-3 text-center">
            Try: "I sleep on my side" or "I run hot at night"
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground/80">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Expert AI Guidance</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/40" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">5 Premium Brands</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/40" />
          <div className="flex items-center gap-2">
            <span>Unbiased Recommendations</span>
          </div>
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
