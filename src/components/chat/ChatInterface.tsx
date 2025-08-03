import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Quote } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  sourceHighlight?: string;
}

interface ChatInterfaceProps {
  transcript: string;
  title: string;
}

export function ChatInterface({ transcript, title }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: `Hi! I'm ready to answer questions about "${title}". I have access to the full transcript, so ask me anything about the content!`,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  }, [title, messages.length]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateAIResponse = (question: string): { answer: string; highlight?: string } => {
    // Simple keyword matching for demo purposes
    const lowerQuestion = question.toLowerCase();
    const transcriptLower = transcript.toLowerCase();
    
    // Find relevant sections based on keywords
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const relevantSentences = sentences.filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return lowerQuestion.split(' ').some(word => 
        word.length > 3 && sentenceLower.includes(word)
      );
    });

    if (relevantSentences.length > 0) {
      const bestMatch = relevantSentences[0].trim();
      return {
        answer: `Based on the transcript, ${bestMatch}. ${relevantSentences.length > 1 ? 'There are also other relevant mentions in the content.' : ''}`,
        highlight: bestMatch
      };
    }

    // Fallback responses
    if (lowerQuestion.includes('summary') || lowerQuestion.includes('about')) {
      const firstPart = transcript.substring(0, 300) + '...';
      return {
        answer: `This content appears to cover: ${firstPart} Would you like me to elaborate on any specific aspect?`,
      };
    }

    return {
      answer: "I couldn't find specific information about that in the transcript. Could you try rephrasing your question or asking about a different topic covered in the content?",
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const { answer, highlight } = simulateAIResponse(input.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: answer,
        role: "assistant",
        timestamp: new Date(),
        sourceHighlight: highlight,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <div className="border-b p-4 bg-card/50">
        <h3 className="font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          Chat about: {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Ask questions about the video content - I have access to the full transcript
        </p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div className={`chat-message ${message.role}`}>
                <p>{message.content}</p>
                
                {message.sourceHighlight && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <Badge variant="outline" className="text-xs mb-2">
                      <Quote className="w-3 h-3 mr-1" />
                      Source
                    </Badge>
                    <p className="text-xs italic opacity-80">
                      "{message.sourceHighlight}"
                    </p>
                  </div>
                )}
                
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <Card className="p-4 bg-muted">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4 bg-card/50">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about the video content..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}