import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Message = { role: "user" | "assistant"; content: string };

import { ProductRecommendationCard } from "./ProductRecommendationCard";

// Convert markdown links, bold text, and product recommendations to React elements
const renderMessageContent = (content: string) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  const productRecommendations: any[] = [];

  lines.forEach((line, lineIdx) => {
    // Check for product recommendation format
    if (line.startsWith('PRODUCT_RECOMMENDATION:')) {
      // Parse: handle?params|reason|features|price
      const parts = line.replace('PRODUCT_RECOMMENDATION:', '').split('|');
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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Forget the showroom. Forget the sales pitch. I know every mattress inside and out—Helix, Leesa, Birch, Plank, Brooklyn Bedding. Let's find your perfect match. What's your primary sleep position?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
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

      setIsLoading(false);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please try again.");
      setIsLoading(false);
    }
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
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Find Your Perfect Mattress
        </h1>
        <p className="text-lg text-muted-foreground">
          No showrooms. No pushy sales. Just honest recommendations.
        </p>
      </div>

      {/* Messages Area */}
      <div className="max-w-3xl mx-auto w-full mb-6 px-4">
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-6 py-4 transition-all duration-300 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20 shadow-md"
                }`}
              >
                <p className="text-base leading-relaxed" style={{ WebkitFontSmoothing: 'antialiased' }}>
                  {renderMessageContent(message.content)}
                </p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20 rounded-3xl px-6 py-4 shadow-md">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="max-w-4xl mx-auto w-full px-4">
        <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 dark:border-white/20 p-4">
          <div className="flex items-center gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about firmness, cooling, back pain..."
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()} 
              size="icon"
              className="h-12 w-12 rounded-full transition-transform hover:scale-110 shadow-lg"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      <div ref={scrollRef} />
    </div>
  );
};
