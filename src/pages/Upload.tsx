import { useState } from "react";
import { FileUpload } from "@/components/upload/FileUpload";
import { YouTubeInput } from "@/components/upload/YouTubeInput";
import { SummaryCard } from "@/components/summary/SummaryCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, Youtube, Loader2 } from "lucide-react";

interface ProcessedContent {
  title: string;
  summary: string;
  transcript: string;
  duration?: string;
  source: "youtube" | "file";
  sourceUrl?: string;
  fileName?: string;
  timestamp: Date;
}

export default function Upload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null);
  const { toast } = useToast();

  const simulateProcessing = async (type: "file" | "youtube", identifier: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Simulate processing stages
      const stages = [
        { progress: 20, message: type === "youtube" ? "Downloading video..." : "Uploading file..." },
        { progress: 40, message: "Extracting audio..." },
        { progress: 60, message: "Transcribing audio..." },
        { progress: 80, message: "Generating summary..." },
        { progress: 100, message: "Complete!" }
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        setProcessingProgress(stage.progress);
        toast({
          title: "Processing",
          description: stage.message,
        });
      }

      // Simulate processed content
      const mockTranscript = `This is a sample transcript of the ${type === "youtube" ? "YouTube video" : "uploaded file"}. 

In this content, we discuss various important topics including technology, innovation, and future trends. The speaker covers multiple perspectives on how artificial intelligence is transforming industries.

Key points mentioned include:
- The rapid advancement of AI technology
- Impact on various industries
- Future implications for society
- Best practices for implementation
- Challenges and opportunities ahead

The discussion also touches on practical applications, real-world examples, and actionable insights for viewers. Throughout the presentation, the speaker emphasizes the importance of understanding these technological shifts and preparing for the future.

This transcript has been automatically generated and may contain some inaccuracies, but captures the main themes and content of the original media.`;

      const mockSummary = `This ${type === "youtube" ? "YouTube video" : "uploaded file"} explores the transformative impact of artificial intelligence across industries. The content covers key technological advancements, practical applications, and future implications for society. Main topics include AI's rapid development, industry-specific impacts, implementation best practices, and the challenges and opportunities ahead.`;

      setProcessedContent({
        title: type === "youtube" ? "AI Technology Discussion" : `Uploaded: ${identifier}`,
        summary: mockSummary,
        transcript: mockTranscript,
        duration: "15:30",
        source: type,
        sourceUrl: type === "youtube" ? identifier : undefined,
        fileName: type === "file" ? identifier : undefined,
        timestamp: new Date(),
      });

      toast({
        title: "Processing complete!",
        description: "Your content has been transcribed and summarized.",
      });

    } catch (error) {
      toast({
        title: "Processing failed",
        description: "An error occurred while processing your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleFileUpload = (file: File) => {
    simulateProcessing("file", file.name);
  };

  const handleYouTubeSubmit = (url: string) => {
    simulateProcessing("youtube", url);
  };

  const resetForm = () => {
    setProcessedContent(null);
    setIsProcessing(false);
    setProcessingProgress(0);
  };

  if (processedContent) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Processing Complete</h1>
          <Button variant="outline" onClick={resetForm}>
            Process Another
          </Button>
        </div>
        <SummaryCard {...processedContent} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Transcript Generator</h1>
        <p className="text-xl text-muted-foreground">
          Extract transcripts and summaries from YouTube videos or upload your own audio/video files
        </p>
      </div>

      {isProcessing ? (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
            <h3 className="text-lg font-semibold">Processing your content...</h3>
            <p className="text-muted-foreground">This may take a few minutes</p>
            <div className="max-w-md mx-auto">
              <Progress value={processingProgress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">{processingProgress}% complete</p>
            </div>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="youtube" className="gap-2">
              <Youtube className="w-4 h-4" />
              YouTube URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <UploadIcon className="w-4 h-4" />
              File Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="space-y-6">
            <YouTubeInput onSubmit={handleYouTubeSubmit} isProcessing={isProcessing} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <FileUpload 
              onFileUpload={handleFileUpload} 
              isUploading={isProcessing}
              uploadProgress={processingProgress}
            />
          </TabsContent>
        </Tabs>
      )}

      <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <UploadIcon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">Easy Upload</h3>
          <p className="text-sm text-muted-foreground">
            Drag & drop files or paste YouTube URLs
          </p>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <Loader2 className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">AI Processing</h3>
          <p className="text-sm text-muted-foreground">
            Automatic transcription and summarization
          </p>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <UploadIcon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">Export & Chat</h3>
          <p className="text-sm text-muted-foreground">
            Download transcripts or ask questions
          </p>
        </div>
      </div>
    </div>
  );
}