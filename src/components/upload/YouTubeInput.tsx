import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Youtube, Download } from "lucide-react";

interface YouTubeInputProps {
  onSubmit: (url: string) => void;
  isProcessing?: boolean;
}

export function YouTubeInput({ onSubmit, isProcessing = false }: YouTubeInputProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const validateYouTubeUrl = (url: string) => {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/(www\.)?youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/
    ];
    
    return patterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a YouTube URL.",
        variant: "destructive",
      });
      return;
    }

    if (!validateYouTubeUrl(url.trim())) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(url.trim());
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
            <Youtube className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold">YouTube Video</h3>
            <p className="text-sm text-muted-foreground">
              Enter a YouTube URL to extract audio and generate transcript
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isProcessing}
            className="w-full"
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing || !url.trim()}
          >
            {isProcessing ? (
              <>
                <Download className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Process Video
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• Supports public YouTube videos</p>
          <p>• Audio will be extracted automatically</p>
          <p>• Processing may take a few minutes</p>
        </div>
      </form>
    </Card>
  );
}