import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

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
    <Card className="w-full max-w-2xl mx-auto h-[700px] flex flex-col shadow-lg border-primary/10 backdrop-blur-sm bg-card/95">
      <div className="p-6 border-b border-primary/10 bg-gradient-to-b from-primary/5 to-transparent">
        <h2 className="text-xl font-bold text-foreground">Your AI Sleep Expert</h2>
        <p className="text-sm text-muted-foreground mt-1 font-medium">No sales pitch. Just science.</p>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-5">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-5 transition-all duration-300 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md"
                    : "bg-muted/50 border border-border/50 shadow-sm hover:shadow-md hover:scale-[1.01]"
                }`}
              >
                <p className="text-[15px] whitespace-pre-wrap leading-relaxed" style={{ WebkitFontSmoothing: 'antialiased' }}>
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-muted/50 border border-border/50 rounded-2xl p-5 shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-primary/10">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 h-14 text-[15px] bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-inner"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()} 
            size="icon"
            className="h-14 w-14 transition-transform hover:scale-105 shadow-md"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};
